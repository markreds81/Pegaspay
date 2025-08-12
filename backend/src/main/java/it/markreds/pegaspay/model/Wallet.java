package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wallets", schema = "pegaspay")
public class Wallet {
    @Id
    @Column(name = "pkid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true, updatable = false)
    private UUID referenceId;

    @OneToOne
    @JoinColumn(name = "fk_account_user", nullable = false, unique = true)
    private AccountUser accountUser;

    @Transient
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name = "created_at")
    private Instant createdAt;

    public Wallet() {
    }

    public Wallet(AccountUser accountUser) {
        this.accountUser = accountUser;
    }

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

    public AccountUser getAccountUser() {
        return accountUser;
    }

    public void setAccountUser(AccountUser accountUser) {
        this.accountUser = accountUser;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
