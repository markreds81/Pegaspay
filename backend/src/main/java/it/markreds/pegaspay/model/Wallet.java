package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets", schema = "pegaspay")
public class Wallet {
    @Id
    @Column(name = "pkid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "fk_account_user", nullable = false, unique = true)
    private AccountUser accountUser;

    @Transient
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Wallet() {
    }

    public Wallet(AccountUser accountUser) {
        this.accountUser = accountUser;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
