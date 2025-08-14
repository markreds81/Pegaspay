package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.*;
import it.markreds.pegaspay.model.Journal;
import it.markreds.pegaspay.model.LedgerEntry;
import it.markreds.pegaspay.model.PaymentIntent;
import it.markreds.pegaspay.model.PaymentStatus;
import it.markreds.pegaspay.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class PaymentService {
    private final PaymentIntentRepository intentRepo;
    private final AccountUserRepository userRepo;
    private final WalletRepository walletRepo;
    private final JournalRepository journalRepo;
    private final LedgerEntryRepository ledgerRepo;
    private final FeePolicy feePolicy;
    private final AdminService adminService;

    public PaymentService(PaymentIntentRepository intentRepo, AccountUserRepository userRepo, WalletRepository walletRepo, JournalRepository journalRepo, LedgerEntryRepository ledgerRepo, FeePolicy feePolicy, AdminService adminService) {
        this.intentRepo = intentRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.journalRepo = journalRepo;
        this.ledgerRepo = ledgerRepo;
        this.feePolicy = feePolicy;
        this.adminService = adminService;
    }

    @Transactional
    public CreatePaymentResponse createPayment(CreatePaymentRequest req, Jwt merchantJwt) {
        var merchantUser = userRepo.findByKeycloakId(UUID.fromString(merchantJwt.getSubject()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Merchant user not found"));

        var merchantWallet = walletRepo.findByAccountUser(merchantUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Merchant wallet not found"));

        var intent = new PaymentIntent();
        intent.setMerchantWallet(merchantWallet);
        intent.setAmount(req.amount());
        intent.setCurrency(req.currency() == null ? "EUR" : req.currency());
        intent.setDescription(req.description());
        intent.setExpiresAt(req.expiresAt());
        intent.setCallbackUrl(req.callbackUrl());
        intent.setStatus(PaymentStatus.REQUIRES_CONFIRMATION);

        intentRepo.save(intent);

        return new CreatePaymentResponse(intent.getReferenceId());
    }

    public List<PaymentIntentSummary> listForMerchant(Jwt merchantJwt, int limit) {
        int safeLimit = Math.max(1, Math.min(100, limit));
        var pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));
        UUID merchantSub = UUID.fromString(merchantJwt.getSubject());

        return intentRepo
                .findByMerchantWallet_AccountUser_KeycloakIdOrderByCreatedAtDesc(merchantSub, pageable)
                .map(this::toSummary)
                .getContent();
    }

    private PaymentIntentSummary toSummary(PaymentIntent p) {
        return new PaymentIntentSummary(
                p.getReferenceId(),
                p.getAmount(),
                p.getCurrency(),
                p.getDescription(),
                p.getStatus(),
                p.getCreatedAt(),
                p.getPaidAt(),
                p.getExpiresAt()
        );
    }

    public PublicPaymentDto getPublicInfo(UUID referenceId) {
        var intent = intentRepo.findByReferenceId(referenceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
        var merchantName = intent.getMerchantWallet().getAccountUser().getUsername();
        return new PublicPaymentDto(
                intent.getReferenceId(), intent.getAmount(), intent.getCurrency(),
                intent.getDescription(), merchantName, intent.getExpiresAt(), intent.getStatus()
        );
    }

    @Transactional
    public ConfirmPaymentResponse confirm(UUID referenceId, Jwt payerJwt) {
        var intent = intentRepo.findByReferenceId(referenceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));

        if (intent.getStatus() != PaymentStatus.REQUIRES_CONFIRMATION) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment not confirmable");
        }
        if (intent.getExpiresAt() != null && Instant.now().isAfter(intent.getExpiresAt())) {
            intent.setStatus(PaymentStatus.EXPIRED);
            intentRepo.save(intent);
            throw new ResponseStatusException(HttpStatus.GONE, "Payment expired");
        }

        var payerUser = userRepo.findByKeycloakId(UUID.fromString(payerJwt.getSubject()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payer user not found"));
        var payerWallet = walletRepo.findByAccountUser(payerUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payer wallet not found"));

        if (payerWallet.getId().equals(intent.getMerchantWallet().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot pay self");
        }

        BigDecimal payerBal = ledgerRepo.calculateBalance(payerWallet);
        if (payerBal.compareTo(intent.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds");
        }

        BigDecimal fee = feePolicy.feeFor(intent.getAmount());
        BigDecimal netToMerchant = intent.getAmount().subtract(fee);

        // Journal
        var j = new Journal();
        j.setDescription("Payment " + intent.getReferenceId());
        journalRepo.save(j);

        // Entries
        var merchantEntry = LedgerEntry.ofDebit(j, intent.getMerchantWallet(), netToMerchant, "Sale proceeds");
        var payerEntry = LedgerEntry.ofCredit(j, payerWallet, intent.getAmount(), "Payment");
        var systemEntry = LedgerEntry.ofDebit(j, adminService.getSystemWallet(), fee, "Fee");

        // verifica di pareggio
        var sum = Stream.of(merchantEntry, payerEntry, systemEntry)
                .map(e -> e.getDebit().subtract(e.getCredit()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Journal not balanced");
        }

        ledgerRepo.save(merchantEntry);
        ledgerRepo.save(payerEntry);
        ledgerRepo.save(systemEntry);

        intent.setStatus(PaymentStatus.PAID);
        intent.setPayerUser(payerUser);
        intent.setPaidAt(Instant.now());
        intentRepo.save(intent);

        var payerAfter = ledgerRepo.calculateBalance(payerWallet);
        var merchantAfter = ledgerRepo.calculateBalance(intent.getMerchantWallet());

        return new ConfirmPaymentResponse(
                j.getReferenceId(), intent.getAmount(), fee, intent.getCurrency(),
                payerAfter, merchantAfter
        );
    }

}
