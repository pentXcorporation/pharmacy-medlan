package com.pharmacy.medlan.dto.request.supplier;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGoodsReceiptRequest {

    private Long purchaseOrderId;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Receipt date is required")
    private LocalDate receiptDate;

    @Size(max = 100, message = "Supplier invoice number cannot exceed 100 characters")
    private String supplierInvoiceNumber;

    private LocalDate supplierInvoiceDate;

    private String remarks;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<GoodsReceiptItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoodsReceiptItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotBlank(message = "Batch number is required")
        @Size(max = 100, message = "Batch number cannot exceed 100 characters")
        private String batchNumber;

        @NotNull(message = "Expiry date is required")
        private LocalDate expiryDate;

        @NotNull(message = "Quantity received is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantityReceived;

        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be positive")
        private BigDecimal unitPrice;
    }
}