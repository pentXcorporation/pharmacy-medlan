package com.pharmacy.medlan.model.user;

import com.pharmacy.medlan.enums.AuthorizationStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_authorizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeAuthorization extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorized_by")
    private User authorizedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "branch_id", insertable = false, updatable = false)
    private Long branchId;

    @Column(name = "transaction_type", nullable = false, length = 100)
    private String transactionType; // DISCOUNT, CREDIT_SALE, VOID, etc.

    @Column(name = "transaction_reference_id")
    private Long transactionReferenceId;

    @Column(name = "authorization_code", unique = true, length = 50)
    private String authorizationCode;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private AuthorizationStatus status = AuthorizationStatus.PENDING;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}