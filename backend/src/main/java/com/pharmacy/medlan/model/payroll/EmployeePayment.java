package com.pharmacy.medlan.model.payroll;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employee_payments", indexes = {
        @Index(name = "idx_emp_payment_user", columnList = "user_id"),
        @Index(name = "idx_emp_payment_date", columnList = "payment_date"),
        @Index(name = "idx_emp_payment_branch", columnList = "branch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"employee", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class EmployeePayment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "Employee is required")
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "payment_date", nullable = false)
    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @Column(name = "worker_name", length = 200)
    private String workerName;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Amount must be positive")
    private BigDecimal amount;

    @Column(name = "reason", length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 50)
    private PaymentMethod paymentMethod;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}