package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CreatePaymentRequest(
        BigDecimal amount,
        String currency,
        String description,
        Instant expiresAt,
        String callbackUrl
) {
}
