package it.markreds.pegaspay.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ledger_entries", schema = "pegaspay")
public class LedgerEntry {
    @Id
    @Column(name = "pkid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "journal_id")
    private Journal journal;

    @ManyToOne(optional = false)
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @Column(nullable = false)
    private BigDecimal debit;

    private BigDecimal credit;

    @Column(nullable = false)
    private String note;

    public LedgerEntry() {
    }

    public LedgerEntry(Journal journal, Wallet wallet, BigDecimal debit, BigDecimal credit, String note) {
        this.journal = journal;
        this.wallet = wallet;
        this.debit = debit;
        this.credit = credit;
        this.note = note;
    }

    public static LedgerEntry ofCredit(Journal journal, Wallet wallet, BigDecimal amount, String note) {
        return new LedgerEntry(journal, wallet, amount, BigDecimal.ZERO, note);
    }

    public static LedgerEntry ofDebit(Journal journal, Wallet wallet, BigDecimal amount, String note) {
        return new LedgerEntry(journal, wallet, BigDecimal.ZERO, amount, note);
    }

    @PrePersist
    protected void onCreate() {
        if (credit == null) {
            credit = BigDecimal.ZERO;
        }
        if (debit == null) {
            debit = BigDecimal.ZERO;
        }
        if (BigDecimal.ZERO.equals(credit) && BigDecimal.ZERO.equals(debit)) {
            throw new IllegalArgumentException("Either credit or debit must be greater then 0");
        }
        if (credit.compareTo(BigDecimal.ZERO) > 0 && debit.compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Only one of credit or debit must be set");
        }
    }

    public Long getId() {
        return id;
    }

    public Journal getJournal() {
        return journal;
    }

    public void setJournal(Journal journal) {
        this.journal = journal;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public BigDecimal getDebit() {
        return debit;
    }

    public void setDebit(BigDecimal debit) {
        this.debit = debit;
    }

    public BigDecimal getCredit() {
        return credit;
    }

    public void setCredit(BigDecimal credit) {
        this.credit = credit;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
