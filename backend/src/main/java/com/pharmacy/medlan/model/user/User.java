package com.pharmacy.medlan.model.user;

import com.pharmacy.medlan.enums.Role;
import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_employee_code", columnList = "employee_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"password", "branchAssignments", "sessions"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Username is required")
    @EqualsAndHashCode.Include
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    @NotBlank(message = "Password is required")
    private String password;

    @Column(name = "full_name", nullable = false, length = 200)
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Column(name = "email", unique = true, length = 100)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    @NotNull(message = "Role is required")
    private Role role;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_login_date")
    private LocalDate lastLoginDate;

    @Column(name = "discount_limit", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountLimit = BigDecimal.ZERO;

    @Column(name = "credit_transaction_limit", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal creditTransactionLimit = BigDecimal.ZERO;

    @Column(name = "employee_code", unique = true, length = 50)
    private String employeeCode;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BranchStaff> branchAssignments = new ArrayList<>();

    public boolean hasRole(Role requiredRole) {
        return this.role == requiredRole;
    }

    public boolean canGiveDiscount(BigDecimal discountAmount) {
        return discountAmount.compareTo(discountLimit) <= 0;
    }
}