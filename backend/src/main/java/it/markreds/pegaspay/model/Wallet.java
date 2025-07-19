package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

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

    public Wallet() {
    }

    public Wallet(AccountUser accountUser) {
        this.accountUser = accountUser;
    }

    // Getters e Setters
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
}
