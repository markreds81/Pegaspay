package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransferResult(
        UUID journalId,
        UUID senderId,
        String senderUsername,
        UUID recipientId,
        String recipientUsername,
        BigDecimal amount,
        String currency,
        Instant timestamp,
        String description
) {
}
