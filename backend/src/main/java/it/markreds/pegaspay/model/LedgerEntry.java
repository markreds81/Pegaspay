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

    private BigDecimal debit;

    private BigDecimal credit;

    private String note;

    // Constructors, getters, setters
    public LedgerEntry() {
    }

    public LedgerEntry(Journal journal, Wallet wallet, BigDecimal debit, BigDecimal credit, String note) {
        this.journal = journal;
        this.wallet = wallet;
        this.debit = debit;
        this.credit = credit;
        this.note = note;
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
