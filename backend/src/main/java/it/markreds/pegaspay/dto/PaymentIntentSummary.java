package it.markreds.pegaspay.dto;

import it.markreds.pegaspay.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentIntentSummary(
        UUID referenceId,
        BigDecimal amount,
        String currency,
        String description,
        PaymentStatus status,
        Instant createdAt,
        Instant paidAt,
        Instant expiresAt
) {
}
