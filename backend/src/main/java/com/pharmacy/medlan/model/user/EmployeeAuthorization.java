package com.pharmacy.medlan.model.user;

import com.pharmacy.medlan.enums.AuthorizationStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_authorizations", indexes = {
        @Index(name = "idx_auth_employee", columnList = "employee_id"),
        @Index(name = "idx_auth_status", columnList = "status"),
        @Index(name = "idx_auth_code", columnList = "authorization_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"employee", "authorizedBy", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class EmployeeAuthorization extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull(message = "Employee is required")
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorized_by")
    private User authorizedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "transaction_type", nullable = false, length = 100)
    @NotBlank(message = "Transaction type is required")
    private String transactionType;

    @Column(name = "transaction_reference_id")
    private Long transactionReferenceId;

    @Column(name = "authorization_code", unique = true, length = 50)
    @EqualsAndHashCode.Include
    private String authorizationCode;

    @Column(name = "amount", precision = 12, scale = 2)
    @DecimalMin(value = "0.0", message = "Amount must be non-negative")
    private BigDecimal amount;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private AuthorizationStatus status = AuthorizationStatus.PENDING;

    @Column(name = "requested_at", nullable = false)
    @NotNull
    private LocalDateTime requestedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    public boolean isPending() {
        return status == AuthorizationStatus.PENDING;
    }

    public boolean isApproved() {
        return status == AuthorizationStatus.APPROVED;
    }

    public void approve(User authorizer) {
        this.status = AuthorizationStatus.APPROVED;
        this.authorizedBy = authorizer;
        this.respondedAt = LocalDateTime.now();
    }

    public void reject(User authorizer, String rejectReason) {
        this.status = AuthorizationStatus.REJECTED;
        this.authorizedBy = authorizer;
        this.respondedAt = LocalDateTime.now();
        this.remarks = rejectReason;
    }
}