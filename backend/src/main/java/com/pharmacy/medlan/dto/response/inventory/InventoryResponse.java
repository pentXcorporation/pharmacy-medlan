package com.pharmacy.medlan.dto.response.inventory;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {

    private Long productId;
    private String productCode;
    private String productName;
    private Long branchId;
    private String branchName;
    private Integer totalQuantity;
    private Integer quantityAvailable;
    private Integer quantityOnHand;
    private Integer quantityAllocated;
    private Integer minimumStock;
    private Integer reorderLevel;
    private BigDecimal averageCostPrice;
    private BigDecimal sellingPrice;
    private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    private List<InventoryBatchResponse> batches;
}
