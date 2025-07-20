package it.markreds.pegaspay.dto;

import java.math.BigDecimal;

public record RedeemResult(BigDecimal balance, String currency) {
}
