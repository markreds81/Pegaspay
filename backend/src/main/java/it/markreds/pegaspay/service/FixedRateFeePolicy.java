package it.markreds.pegaspay.service;


import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class FixedRateFeePolicy implements FeePolicy {
    private static final BigDecimal RATE = new BigDecimal("0.015");

    @Override
    public BigDecimal feeFor(BigDecimal amount) {
        return amount.multiply(RATE).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
