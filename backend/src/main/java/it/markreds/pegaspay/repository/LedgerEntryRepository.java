package it.markreds.pegaspay.repository;

import it.markreds.pegaspay.model.LedgerEntry;
import it.markreds.pegaspay.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    @Query("""
            SELECT COALESCE(SUM(e.debit), 0) - COALESCE(SUM(e.credit), 0)
            FROM LedgerEntry e
            WHERE e.wallet = :wallet
            """)
    BigDecimal calculateBalance(@Param("wallet") Wallet wallet);
}
