package com.pharmacy.medlan.model.supplier;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "supplier_payments", indexes = {
        @Index(name = "idx_sp_number", columnList = "payment_number"),
        @Index(name = "idx_sp_supplier", columnList = "supplier_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"supplier", "branch", "paidByUser", "paymentDetails"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class SupplierPayment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "payment_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Payment number is required")
    @EqualsAndHashCode.Include
    private String paymentNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    @NotNull(message = "Supplier is required")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "payment_date", nullable = false)
    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Amount must be positive")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 50)
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Column(name = "cheque_number", length = 100)
    private String chequeNumber;

    @Column(name = "cheque_date")
    private LocalDate chequeDate;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PAID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by_user_id")
    private User paidByUser;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}