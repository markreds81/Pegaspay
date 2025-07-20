package it.markreds.pegaspay.dto;

import java.math.BigDecimal;

public record TransferRequest(String toUserEmail, BigDecimal amount, String currency) {
}
