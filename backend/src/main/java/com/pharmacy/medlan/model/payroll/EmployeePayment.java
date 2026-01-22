package com.pharmacy.medlan.model.payroll;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employee_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeePayment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "worker_name", length = 200)
    private String workerName;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 50)
    private PaymentMethod paymentMethod;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}
