package com.pharmacy.medlan.dto.request.inventory;

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
public class CreateGRNRequest {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private Long purchaseOrderId;

    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;

    @Size(max = 100, message = "Supplier invoice number cannot exceed 100 characters")
    private String supplierInvoiceNumber;

    private LocalDate supplierInvoiceDate;

    @Size(max = 1000, message = "Remarks cannot exceed 1000 characters")
    private String remarks;

    @NotEmpty(message = "GRN must have at least one item")
    @Valid
    private List<GRNLineRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GRNLineRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotBlank(message = "Batch number is required")
        @Size(max = 100, message = "Batch number cannot exceed 100 characters")
        private String batchNumber;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotNull(message = "Cost price is required")
        @DecimalMin(value = "0.01", message = "Cost price must be greater than 0")
        private BigDecimal costPrice;

        @NotNull(message = "Selling price is required")
        @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
        private BigDecimal sellingPrice;

        @NotNull(message = "MRP is required")
        @DecimalMin(value = "0.01", message = "MRP must be greater than 0")
        private BigDecimal mrp;

        private LocalDate manufacturingDate;

        @NotNull(message = "Expiry date is required")
        private LocalDate expiryDate;

        @DecimalMin(value = "0.00", message = "Discount cannot be negative")
        private BigDecimal discountAmount;
    }
}