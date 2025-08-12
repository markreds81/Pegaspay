package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record WalletDto(BigDecimal balance, String currency, Instant createdAt,
                        String ownerFirstName, String ownerLastName) {
}
