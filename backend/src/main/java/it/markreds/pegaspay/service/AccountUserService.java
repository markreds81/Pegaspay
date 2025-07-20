package it.markreds.pegaspay.service;

import it.markreds.pegaspay.model.AccountUser;
import it.markreds.pegaspay.model.Wallet;
import it.markreds.pegaspay.repository.AccountUserRepository;
import it.markreds.pegaspay.repository.LedgerEntryRepository;
import it.markreds.pegaspay.repository.WalletRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AccountUserService {
    private final AccountUserRepository userRepository;
    private final WalletRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    public AccountUserService(AccountUserRepository userRepository, WalletRepository walletRepository, LedgerEntryRepository ledgerEntryRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
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
}
