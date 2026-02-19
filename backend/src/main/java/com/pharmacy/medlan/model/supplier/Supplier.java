package com.pharmacy.medlan.model.supplier;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "suppliers", indexes = {
        @Index(name = "idx_supplier_code", columnList = "supplier_code"),
        @Index(name = "idx_supplier_name", columnList = "supplier_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"purchaseOrders", "payments"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Supplier extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "supplier_code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Supplier code is required")
    @EqualsAndHashCode.Include
    private String supplierCode;

    @Column(name = "supplier_name", nullable = false, length = 200)
    @NotBlank(message = "Supplier name is required")
    private String supplierName;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 20)
    private String pincode;

    @Column(name = "gstin_number", length = 50)
    private String gstinNumber;

    @Column(name = "pan_number", length = 50)
    private String panNumber;

    @Column(name = "drug_license_number", length = 50)
    private String drugLicenseNumber;

    @Column(name = "default_discount_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal defaultDiscountPercent = BigDecimal.ZERO;

    @Column(name = "payment_term_days")
    @Builder.Default
    private Integer paymentTermDays = 30;

    @Column(name = "credit_limit", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal creditLimit = BigDecimal.ZERO;

    @Column(name = "current_balance", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}