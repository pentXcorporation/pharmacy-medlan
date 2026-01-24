package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.enums.CashRegisterStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Cash Register Entity
 * Represents daily cash register operations (opening/closing, cash in/out)
 */
@Entity
@Table(name = "cash_registers", indexes = {
        @Index(name = "idx_register_date", columnList = "register_date"),
        @Index(name = "idx_register_branch", columnList = "branch_id"),
        @Index(name = "idx_register_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashRegister extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "register_date", nullable = false)
    private LocalDate registerDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by", nullable = false)
    private User openedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by")
    private User closedBy;

    @Column(name = "opening_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal openingBalance;

    @Column(name = "closing_balance", precision = 12, scale = 2)
    private BigDecimal closingBalance;

    @Column(name = "expected_closing_balance", precision = 12, scale = 2)
    private BigDecimal expectedClosingBalance;

    @Column(name = "cash_in_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal cashInTotal = BigDecimal.ZERO;

    @Column(name = "cash_out_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal cashOutTotal = BigDecimal.ZERO;

    @Column(name = "sales_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal salesTotal = BigDecimal.ZERO;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private CashRegisterStatus status = CashRegisterStatus.OPEN;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "discrepancy", precision = 12, scale = 2)
    private BigDecimal discrepancy;

    // Reference to bank account if cash is deposited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id")
    private Bank bank;

    @Column(name = "deposited_amount", precision = 12, scale = 2)
    private BigDecimal depositedAmount;

    @Column(name = "deposited_at")
    private LocalDateTime depositedAt;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;
}
