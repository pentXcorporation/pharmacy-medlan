package com.pharmacy.medlan.dto.request.inventory;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStockTransferRequest {

    @NotNull(message = "From branch ID is required")
    private Long fromBranchId;

    @NotNull(message = "To branch ID is required")
    private Long toBranchId;

    private LocalDate expectedReceiptDate;

    private String remarks;

    @NotEmpty(message = "At least one transfer item is required")
    @Valid
    private List<StockTransferItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockTransferItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long inventoryBatchId;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantityTransferred;

        private String remarks;
    }
}
