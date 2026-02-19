package com.pharmacy.medlan.dto.request.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePricingRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.00", message = "Cost price must not be negative")
    private BigDecimal costPrice;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be positive")
    private BigDecimal sellingPrice;

    @NotNull(message = "MRP is required")
    @DecimalMin(value = "0.01", message = "MRP must be positive")
    private BigDecimal mrp;

    private BigDecimal profitMargin;

    private LocalDate effectiveDate;
}
