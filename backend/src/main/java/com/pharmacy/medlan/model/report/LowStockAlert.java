package com.pharmacy.medlan.model.report;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "low_stock_alerts", indexes = {
        @Index(name = "idx_lowstock_product", columnList = "product_id"),
        @Index(name = "idx_lowstock_branch", columnList = "branch_id"),
        @Index(name = "idx_lowstock_acknowledged", columnList = "is_acknowledged")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class LowStockAlert extends BaseEntity {

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

    @Column(name = "current_stock", nullable = false)
    @Min(value = 0, message = "Current stock must be non-negative")
    private Integer currentStock;

    @Column(name = "reorder_level", nullable = false)
    @Min(value = 0, message = "Reorder level must be non-negative")
    private Integer reorderLevel;

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