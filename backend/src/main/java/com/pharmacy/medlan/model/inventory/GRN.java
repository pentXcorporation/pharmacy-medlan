package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.enums.GRNStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.supplier.PurchaseOrder;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grns", indexes = {
        @Index(name = "idx_grn_number", columnList = "grn_number"),
        @Index(name = "idx_grn_status", columnList = "status"),
        @Index(name = "idx_grn_date", columnList = "received_date"),
        @Index(name = "idx_grn_supplier", columnList = "supplier_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"purchaseOrder", "supplier", "branch", "receivedBy", "approvedBy", "grnLines"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class GRN extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "grn_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "GRN number is required")
    @EqualsAndHashCode.Include
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    @NotNull(message = "Supplier is required")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "received_date", nullable = false)
    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;

    @Column(name = "supplier_invoice_number", length = 100)
    private String supplierInvoiceNumber;

    @Column(name = "supplier_invoice_date")
    private LocalDate supplierInvoiceDate;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Total amount must be positive")
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "net_amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private GRNStatus status = GRNStatus.DRAFT;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by_user_id")
    private User receivedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 50)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GRNLine> grnLines = new ArrayList<>();

    public boolean isApproved() {
        return status == GRNStatus.COMPLETED;
    }

    public boolean isPaid() {
        return paymentStatus == PaymentStatus.PAID;
    }
}