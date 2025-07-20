package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.RedeemResult;
import it.markreds.pegaspay.dto.TransferResult;
import it.markreds.pegaspay.model.*;
import it.markreds.pegaspay.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AccountUserService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AccountUserService.class);

    private final AccountUserRepository userRepository;
    private final RechargeCodeRepository codeRepository;
    private final WalletRepository walletRepository;
    private final JournalRepository journalRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final AdminService adminService;

    public AccountUserService(AccountUserRepository userRepository, RechargeCodeRepository codeRepository, WalletRepository walletRepository, JournalRepository journalRepository, LedgerEntryRepository ledgerEntryRepository, AdminService adminService) {
        this.userRepository = userRepository;
        this.codeRepository = codeRepository;
        this.walletRepository = walletRepository;
        this.journalRepository = journalRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.adminService = adminService;
    }

    public Wallet getWalletOf(UUID userId) {
        AccountUser user = userRepository.findByKeycloakId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Wallet wallet = walletRepository.findByAccountUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));

        BigDecimal balance = ledgerEntryRepository.calculateBalance(wallet);
        wallet.setBalance(balance);

        return wallet;
    }

    @Transactional
    public RedeemResult redeemCode(UUID userId, String code) {
        RechargeCode rechargeCode = codeRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Code not found: " + code));

        if (rechargeCode.isRedeemed()) {
            throw new IllegalArgumentException("Code already redeemed");
        }

        if (rechargeCode.getRedeemedAt() != null) {
            throw new IllegalArgumentException("Code already redeemed at " + rechargeCode.getRedeemedAt());
        }

        AccountUser user = userRepository.findByKeycloakId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Wallet wallet = walletRepository.findByAccountUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for user: " + userId));

        Journal journal = new Journal();
        journal.setDescription("Recharge code redeemed");
        journalRepository.save(journal);

        LedgerEntry debitEntry = new LedgerEntry();
        debitEntry.setWallet(adminService.getSystemWallet());
        debitEntry.setJournal(journal);
        debitEntry.setDebit(rechargeCode.getAmount());
        debitEntry.setNote("Recharge code redeemed");

        LedgerEntry creditEntry = new LedgerEntry();
        creditEntry.setWallet(wallet);
        creditEntry.setJournal(journal);
        creditEntry.setCredit(rechargeCode.getAmount());
        creditEntry.setNote("Recharge code redeemed");

        ledgerEntryRepository.save(debitEntry);
        ledgerEntryRepository.save(creditEntry);

        rechargeCode.setRedeemed(true);
        rechargeCode.setRedeemedAt(journal.getCreatedAt());
        rechargeCode.setRedeemedBy(user);
        codeRepository.save(rechargeCode);

        log.debug("Code {} redeemed for user {}", code, userId);

        BigDecimal balance = ledgerEntryRepository.calculateBalance(wallet);

        return new RedeemResult(balance, wallet.getCurrency());
    }

    @Transactional
    public TransferResult transfer(UUID fromUserId, String toUserEmail, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        }

        AccountUser recipientUser = userRepository.findByEmailIgnoreCase(toUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + toUserEmail));
        AccountUser giverUser = userRepository.findByKeycloakId(fromUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + fromUserId));
        Wallet sourceWallet = walletRepository.findByAccountUser(giverUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found for sender"));
        Wallet targetWallet = walletRepository.findByAccountUser(recipientUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found for recipient"));

        BigDecimal balance = ledgerEntryRepository.calculateBalance(sourceWallet);
        if (balance.compareTo(amount) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds");
        }

        Journal journal = new Journal();
        journal.setDescription("Transfer from " + giverUser.getUsername() + " to " + recipientUser.getUsername());
        journalRepository.save(journal);

        LedgerEntry debitEntry = new LedgerEntry();
        debitEntry.setWallet(sourceWallet);
        debitEntry.setJournal(journal);
        debitEntry.setDebit(amount);
        debitEntry.setNote("Transfer to " + recipientUser.getUsername());

        LedgerEntry creditEntry = new LedgerEntry();
        creditEntry.setWallet(targetWallet);
        creditEntry.setJournal(journal);
        creditEntry.setCredit(amount);
        creditEntry.setNote("Transfer from " + giverUser.getUsername());

        ledgerEntryRepository.save(debitEntry);
        ledgerEntryRepository.save(creditEntry);

        return new TransferResult(
                journal.getReferenceId(),
                giverUser.getKeycloakId(),
                giverUser.getUsername(),
                recipientUser.getKeycloakId(),
                recipientUser.getUsername(),
                amount,
                targetWallet.getCurrency(),
                journal.getCreatedAt(),
                journal.getDescription()
        );
    }
}
