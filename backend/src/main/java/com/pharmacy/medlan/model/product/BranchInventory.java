package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "branch_inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "branch_id"}),
        indexes = {
                @Index(name = "idx_branch_inv_product", columnList = "product_id"),
                @Index(name = "idx_branch_inv_branch", columnList = "branch_id"),
                @Index(name = "idx_branch_inv_available", columnList = "quantity_available")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class BranchInventory extends AuditableEntity {

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

    @Column(name = "quantity_on_hand", nullable = false)
    @Builder.Default
    private Integer quantityOnHand = 0;

    @Column(name = "quantity_allocated", nullable = false)
    @Builder.Default
    private Integer quantityAllocated = 0;

    @Column(name = "quantity_available", nullable = false)
    @Builder.Default
    private Integer quantityAvailable = 0;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "minimum_stock")
    private Integer minimumStock;

    @Column(name = "maximum_stock")
    private Integer maximumStock;

    public void updateAvailableQuantity() {
        this.quantityAvailable = this.quantityOnHand - this.quantityAllocated;
    }

    public boolean isLowStock() {
        return reorderLevel != null && quantityAvailable <= reorderLevel;
    }

    public void addStock(int quantity) {
        this.quantityOnHand += quantity;
        updateAvailableQuantity();
    }

    public void removeStock(int quantity) {
        this.quantityOnHand -= quantity;
        updateAvailableQuantity();
    }
}