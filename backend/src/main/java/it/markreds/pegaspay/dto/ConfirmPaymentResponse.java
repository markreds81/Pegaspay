package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ConfirmPaymentResponse(
        UUID journalReferenceId,
        BigDecimal amount,
        BigDecimal fee,
        String currency,
        BigDecimal payerBalanceAfter,
        BigDecimal merchantBalanceAfter
) {
}
