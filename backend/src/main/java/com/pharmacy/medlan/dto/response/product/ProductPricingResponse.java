package com.pharmacy.medlan.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPricingResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private LocalDate effectiveDate;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;
    private BigDecimal profitMargin;
    private Boolean isCurrent;
    private LocalDateTime createdAt;
}
