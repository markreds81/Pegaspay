package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record JournalTransaction(
        UUID referenceId,
        LocalDateTime createdAt,
        String description,
        BigDecimal credit,
        BigDecimal debit,
        String note
) {
}
