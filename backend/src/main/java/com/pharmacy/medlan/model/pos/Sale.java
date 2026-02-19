package com.pharmacy.medlan.model.pos;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales", indexes = {
        @Index(name = "idx_sale_number", columnList = "sale_number"),
        @Index(name = "idx_sale_date", columnList = "sale_date"),
        @Index(name = "idx_sale_customer", columnList = "customer_id"),
        @Index(name = "idx_sale_branch", columnList = "branch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"invoice", "branch", "customer", "soldBy", "saleItems"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Sale extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "sale_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Sale number is required")
    @EqualsAndHashCode.Include
    private String saleNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @NotNull(message = "Invoice is required")
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "sale_date", nullable = false)
    @NotNull(message = "Sale date is required")
    private LocalDateTime saleDate;

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Subtotal must be positive")
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "change_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal changeAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 50)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private SaleStatus status = SaleStatus.COMPLETED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sold_by_user_id")
    private User soldBy;

    @Column(name = "patient_name", length = 200)
    private String patientName;

    @Column(name = "doctor_name", length = 200)
    private String doctorName;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SaleItem> saleItems = new ArrayList<>();

    public boolean isCompleted() {
        return status == SaleStatus.COMPLETED;
    }

    public BigDecimal calculateNetAmount() {
        return subtotal.subtract(discountAmount).add(taxAmount);
    }
}