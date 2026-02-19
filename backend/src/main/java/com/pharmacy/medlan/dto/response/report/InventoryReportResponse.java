package com.pharmacy.medlan.dto.response.report;

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
public class InventoryReportResponse {

    private Long branchId;
    private String branchName;
    private Integer totalProducts;
    private Integer totalBatches;
    private BigDecimal totalStockValue;
    private Integer lowStockProductCount;
    private Integer outOfStockProductCount;
    private Integer expiringBatchCount;
    private Integer expiredBatchCount;
    private List<ProductStockSummary> productSummaries;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductStockSummary {
        private Long productId;
        private String productName;
        private String productCode;
        private Integer quantityOnHand;
        private Integer reorderLevel;
        private BigDecimal stockValue;
        private Integer expiringBatches;
        private String status;
    }
}
