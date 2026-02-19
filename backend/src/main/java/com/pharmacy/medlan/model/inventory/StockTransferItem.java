package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "stock_transfer_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"stockTransfer", "product", "inventoryBatch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class StockTransferItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_transfer_id", nullable = false)
    @NotNull(message = "Stock transfer is required")
    private StockTransfer stockTransfer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_batch_id")
    private InventoryBatch inventoryBatch;

    @Column(name = "quantity_transferred", nullable = false)
    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantityTransferred;

    @Column(name = "quantity_received")
    @Min(value = 0, message = "Quantity received must be non-negative")
    private Integer quantityReceived;

    @Column(name = "remarks", length = 500)
    private String remarks;
}