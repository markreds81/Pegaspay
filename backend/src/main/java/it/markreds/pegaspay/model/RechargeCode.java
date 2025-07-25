package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recharge_codes", schema = "pegaspay")
public class RechargeCode {
    @Id
    @Column(name = "pkid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "is_redeemed", nullable = false)
    private boolean redeemed = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @ManyToOne
    private AccountUser redeemedBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getRedeemedAt() {
        return redeemedAt;
    }

    public void setRedeemedAt(LocalDateTime redeemedAt) {
        this.redeemedAt = redeemedAt;
    }

    public AccountUser getRedeemedBy() {
        return redeemedBy;
    }

    public void setRedeemedBy(AccountUser redeemedBy) {
        this.redeemedBy = redeemedBy;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public boolean isRedeemed() {
        return redeemed;
    }

    public void setRedeemed(boolean redeemed) {
        this.redeemed = redeemed;
    }

    @Override
    public String toString() {
        return "RechargeCode [id=" + id + ", code=" + code + ", amount=" + amount + ", redeemed=" + redeemed + ", createdAt="
                + createdAt + ", redeemedAt=" + redeemedAt + ", redeemedBy=" + redeemedBy + "]";
    }
}
