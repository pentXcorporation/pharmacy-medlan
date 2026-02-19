package com.pharmacy.medlan.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private Long branchId;
    private String branchName;
    private Integer totalSalesCount;
    private BigDecimal totalSalesAmount;
    private BigDecimal totalDiscount;
    private BigDecimal totalProfit;
    private BigDecimal averageSaleValue;
    private BigDecimal cashSalesAmount;
    private BigDecimal cardSalesAmount;
    private BigDecimal creditSalesAmount;
    private Integer returnCount;
    private BigDecimal returnAmount;
    private List<TopSellingProduct> topSellingProducts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopSellingProduct {
        private Long productId;
        private String productName;
        private String productCode;
        private Integer quantitySold;
        private BigDecimal totalRevenue;
        private BigDecimal totalProfit;
    }
}
