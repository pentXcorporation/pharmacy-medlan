package com.pharmacy.medlan.dto.request.pos;

import com.pharmacy.medlan.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSaleRequest {

    private Long customerId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotEmpty(message = "Sale must have at least one item")
    @Valid
    private List<SaleItemRequest> items;

    @DecimalMin(value = "0.00", message = "Discount cannot be negative")
    private BigDecimal discountAmount;

    @Min(value = 0, message = "Discount percent cannot be negative")
    @Max(value = 100, message = "Discount percent cannot exceed 100")
    private BigDecimal discountPercent;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Paid amount is required")
    @DecimalMin(value = "0.00", message = "Paid amount cannot be negative")
    private BigDecimal paidAmount;

    @Size(max = 200, message = "Patient name cannot exceed 200 characters")
    private String patientName;

    @Size(max = 200, message = "Doctor name cannot exceed 200 characters")
    private String doctorName;

    @Size(max = 1000, message = "Remarks cannot exceed 1000 characters")
    private String remarks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaleItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long inventoryBatchId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @DecimalMin(value = "0.00", message = "Discount cannot be negative")
        private BigDecimal discountAmount;
    }
}
