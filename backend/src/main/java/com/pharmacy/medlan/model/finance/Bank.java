package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "banks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "transactions")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Bank extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "bank_name", nullable = false, length = 200)
    @NotBlank(message = "Bank name is required")
    private String bankName;

    @Column(name = "account_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Account number is required")
    @EqualsAndHashCode.Include
    private String accountNumber;

    @Column(name = "ifsc_code", length = 50)
    private String ifscCode;

    @Column(name = "branch_name", length = 200)
    private String branchName;

    @Column(name = "account_holder_name", length = 200)
    private String accountHolderName;

    @Column(name = "account_type", length = 50)
    private String accountType;

    @Column(name = "current_balance", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Column(name = "opening_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public void credit(BigDecimal amount) {
        this.currentBalance = this.currentBalance.add(amount);
    }

    public void debit(BigDecimal amount) {
        this.currentBalance = this.currentBalance.subtract(amount);
    }
}