package com.pharmacy.medlan.model.report;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expiry_alerts", indexes = {
        @Index(name = "idx_expiry_product", columnList = "product_id"),
        @Index(name = "idx_expiry_date", columnList = "expiry_date"),
        @Index(name = "idx_expiry_acknowledged", columnList = "is_acknowledged")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "inventoryBatch", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class ExpiryAlert extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_batch_id", nullable = false)
    @NotNull(message = "Inventory batch is required")
    private InventoryBatch inventoryBatch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(name = "expiry_date", nullable = false)
    @NotNull
    private LocalDate expiryDate;

    @Column(name = "days_to_expiry", nullable = false)
    private Integer daysToExpiry;

    @Column(name = "quantity_available", nullable = false)
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantityAvailable;

    @Column(name = "batch_value", precision = 12, scale = 2)
    private BigDecimal batchValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_level", nullable = false, length = 50)
    @NotNull
    private AlertLevel alertLevel;

    @Column(name = "alert_generated_at", nullable = false)
    @NotNull
    private LocalDateTime alertGeneratedAt;

    @Column(name = "is_acknowledged", nullable = false)
    @Builder.Default
    private Boolean isAcknowledged = false;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    public void acknowledge() {
        this.isAcknowledged = true;
        this.acknowledgedAt = LocalDateTime.now();
    }
}