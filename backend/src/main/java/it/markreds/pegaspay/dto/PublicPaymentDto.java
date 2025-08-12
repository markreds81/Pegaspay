package it.markreds.pegaspay.dto;

import it.markreds.pegaspay.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PublicPaymentDto(
        UUID referenceId,
        BigDecimal amount,
        String currency,
        String description,
        String merchantName,
        Instant expiresAt,
        PaymentStatus status
) {
}
