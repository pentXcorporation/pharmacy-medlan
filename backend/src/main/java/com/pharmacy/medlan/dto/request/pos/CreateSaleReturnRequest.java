package com.pharmacy.medlan.dto.request.pos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSaleReturnRequest {

    private Long originalSaleId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private Long customerId;

    @NotNull(message = "Return reason is required")
    private String returnReason;

    @NotEmpty(message = "At least one return item is required")
    @Valid
    private List<SaleReturnItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaleReturnItemRequest {

        private Long originalSaleItemId;

        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long inventoryBatchId;

        @NotNull(message = "Quantity returned is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantityReturned;

        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be positive")
        private BigDecimal unitPrice;

        private String returnReason;
    }
}
