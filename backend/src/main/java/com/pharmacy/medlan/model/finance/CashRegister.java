package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.enums.CashRegisterStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
@ToString(exclude = {"branch", "openedBy", "closedBy", "bank"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class CashRegister extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "register_date", nullable = false)
    @NotNull(message = "Register date is required")
    private LocalDate registerDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by", nullable = false)
    @NotNull(message = "Opened by user is required")
    private User openedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by")
    private User closedBy;

    @Column(name = "opening_balance", nullable = false, precision = 12, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Opening balance must be non-negative")
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
    @NotNull
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id")
    private Bank bank;

    @Column(name = "deposited_amount", precision = 12, scale = 2)
    private BigDecimal depositedAmount;

    @Column(name = "deposited_at")
    private LocalDateTime depositedAt;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    public boolean isOpen() {
        return status == CashRegisterStatus.OPEN;
    }

    public boolean isClosed() {
        return status == CashRegisterStatus.CLOSED;
    }

    public BigDecimal calculateExpectedBalance() {
        return openingBalance.add(cashInTotal).add(salesTotal).subtract(cashOutTotal);
    }
}