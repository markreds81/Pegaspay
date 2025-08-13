package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_intents", schema = "pegaspay")
public class PaymentIntent {
    @Id
    @Column(name = "pkid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true, updatable = false)
    private UUID referenceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "merchant_wallet_id")
    private Wallet merchantWallet;

    @ManyToOne
    @JoinColumn(name = "payer_user_id")
    private AccountUser payerUser;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PaymentStatus status = PaymentStatus.CREATED;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(length = 512)
    private String callbackUrl;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        referenceId = UUID.randomUUID();
    }

    public Long getId() {
        return id;
    }

    public UUID getReferenceId() {
        return referenceId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Wallet getMerchantWallet() {
        return merchantWallet;
    }

    public void setMerchantWallet(Wallet merchantWallet) {
        this.merchantWallet = merchantWallet;
    }

    public AccountUser getPayerUser() {
        return payerUser;
    }

    public void setPayerUser(AccountUser payerUser) {
        this.payerUser = payerUser;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }
}
