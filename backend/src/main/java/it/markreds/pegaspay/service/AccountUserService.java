package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.TransferResult;
import it.markreds.pegaspay.model.AccountUser;
import it.markreds.pegaspay.model.Journal;
import it.markreds.pegaspay.model.LedgerEntry;
import it.markreds.pegaspay.model.Wallet;
import it.markreds.pegaspay.repository.AccountUserRepository;
import it.markreds.pegaspay.repository.JournalRepository;
import it.markreds.pegaspay.repository.LedgerEntryRepository;
import it.markreds.pegaspay.repository.WalletRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AccountUserService {
    private final AccountUserRepository userRepository;
    private final WalletRepository walletRepository;
    private final JournalRepository journalRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    public AccountUserService(AccountUserRepository userRepository, WalletRepository walletRepository, JournalRepository journalRepository, LedgerEntryRepository ledgerEntryRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.journalRepository = journalRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
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
    public TransferResult transfer(UUID fromUserId, String toUserEmail, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        }

        AccountUser recipientUser = userRepository.findByEmail(toUserEmail)
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
        journal.setCreatedAt(LocalDateTime.now());
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
                journal.getJournalId(),
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
