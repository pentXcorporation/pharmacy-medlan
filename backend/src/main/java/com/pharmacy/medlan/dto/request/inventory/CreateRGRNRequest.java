package com.pharmacy.medlan.dto.request.inventory;

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
public class CreateRGRNRequest {

    private Long originalGrnId;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Return reason is required")
    private String returnReason;

    private String remarks;

    @NotEmpty(message = "At least one return line is required")
    @Valid
    private List<RGRNLineRequest> lines;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RGRNLineRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long inventoryBatchId;

        private String batchNumber;

        @NotNull(message = "Quantity returned is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantityReturned;

        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be positive")
        private BigDecimal unitPrice;

        private String returnReason;
    }
}
