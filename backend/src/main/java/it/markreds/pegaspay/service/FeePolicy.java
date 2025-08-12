package it.markreds.pegaspay.service;

import java.math.BigDecimal;

public interface FeePolicy {
    BigDecimal feeFor(BigDecimal amount);
}
