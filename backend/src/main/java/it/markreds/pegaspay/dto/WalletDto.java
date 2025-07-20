package it.markreds.pegaspay.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WalletDto(BigDecimal balance, String currency, LocalDateTime createdAt,
                        String ownerFirstName, String ownerLastName) {
}
