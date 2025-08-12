package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record JournalTransaction(
        UUID referenceId,
        Instant createdAt,
        String description,
        BigDecimal credit,
        BigDecimal debit,
        BigDecimal balance,
        BigDecimal runningBalance,
        String note
) {
}
