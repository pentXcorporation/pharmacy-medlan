package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.inventory.GRNLine;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "inventory_batches", indexes = {
        @Index(name = "idx_batch_expiry", columnList = "expiry_date"),
        @Index(name = "idx_batch_product", columnList = "product_id"),
        @Index(name = "idx_batch_branch", columnList = "branch_id"),
        @Index(name = "idx_batch_active", columnList = "is_active"),
        @Index(name = "idx_batch_number", columnList = "batch_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "branch", "grnLine"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class InventoryBatch extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "batch_number", nullable = false, length = 100)
    @NotBlank(message = "Batch number is required")
    @EqualsAndHashCode.Include
    private String batchNumber;

    @Column(name = "manufacturing_date", nullable = false)
    @NotNull(message = "Manufacturing date is required")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date", nullable = false)
    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @Column(name = "quantity_received", nullable = false)
    @Min(value = 0, message = "Quantity received must be non-negative")
    private Integer quantityReceived;

    @Column(name = "quantity_available", nullable = false)
    @Min(value = 0, message = "Quantity available must be non-negative")
    private Integer quantityAvailable;

    @Column(name = "quantity_sold", nullable = false)
    @Builder.Default
    @Min(value = 0, message = "Quantity sold must be non-negative")
    private Integer quantitySold = 0;

    @Column(name = "quantity_damaged", nullable = false)
    @Builder.Default
    @Min(value = 0, message = "Quantity damaged must be non-negative")
    private Integer quantityDamaged = 0;

    @Column(name = "quantity_returned", nullable = false)
    @Builder.Default
    @Min(value = 0, message = "Quantity returned must be non-negative")
    private Integer quantityReturned = 0;

    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Purchase price must be non-negative")
    private BigDecimal purchasePrice;

    @Column(name = "mrp", nullable = false, precision = 10, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "MRP must be non-negative")
    private BigDecimal mrp;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grn_line_id")
    private GRNLine grnLine;

    @Column(name = "is_expired", nullable = false)
    @Builder.Default
    private Boolean isExpired = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "days_to_expiry_alert")
    @Builder.Default
    private Integer daysToExpiryAlert = 90;

    @Column(name = "rack_location", length = 50)
    private String rackLocation;

    public long getDaysToExpiry() {
        return ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }

    public boolean isExpiringSoon() {
        return getDaysToExpiry() <= daysToExpiryAlert && getDaysToExpiry() > 0;
    }

    public boolean isExpiredNow() {
        return LocalDate.now().isAfter(expiryDate) || Boolean.TRUE.equals(isExpired);
    }

    public void deductStock(int quantity) {
        this.quantityAvailable -= quantity;
        this.quantitySold += quantity;
    }

    public void addStock(int quantity) {
        this.quantityAvailable += quantity;
    }
}