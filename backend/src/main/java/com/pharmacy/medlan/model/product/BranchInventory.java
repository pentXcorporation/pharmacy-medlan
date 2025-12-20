package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branch_inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "branch_id"}),
        indexes = {
                @Index(name = "idx_branch_inv_product", columnList = "product_id"),
                @Index(name = "idx_branch_inv_branch", columnList = "branch_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchInventory extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand = 0;

    @Column(name = "quantity_allocated", nullable = false)
    private Integer quantityAllocated = 0; // Reserved for pending orders

    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable = 0; // On hand - Allocated

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "minimum_stock")
    private Integer minimumStock;

    @Column(name = "maximum_stock")
    private Integer maximumStock;
}
