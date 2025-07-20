package it.markreds.pegaspay.repository;

import it.markreds.pegaspay.model.AccountUser;
import it.markreds.pegaspay.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByAccountUser(AccountUser accountUser);
}
