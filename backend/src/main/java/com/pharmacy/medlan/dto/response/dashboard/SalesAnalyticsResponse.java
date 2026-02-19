package com.pharmacy.medlan.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Sales analytics response for dashboard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesAnalyticsResponse {

    /**
     * Date range
     */
    private LocalDate startDate;
    private LocalDate endDate;
    private Long branchId;

    /**
     * Summary metrics
     */
    private BigDecimal totalSales;
    private BigDecimal totalProfit;
    private int totalTransactions;
    private BigDecimal averageOrderValue;
    private BigDecimal averageProfitMargin;

    /**
     * Comparison with previous period
     */
    private BigDecimal salesGrowth;
    private BigDecimal profitGrowth;
    private Double transactionGrowth;

    /**
     * Sales by day
     */
    private List<DailySales> dailySales;

    /**
     * Sales by category
     */
    private List<CategorySales> categorySales;

    /**
     * Sales by payment method
     */
    private Map<String, BigDecimal> paymentMethodSales;

    /**
     * Peak hours analysis
     */
    private List<HourlySales> hourlySalesPattern;

    /**
     * Top performing products
     */
    private List<ProductPerformance> topProducts;

    /**
     * Sales by staff
     */
    private List<StaffPerformance> staffPerformance;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySales {
        private LocalDate date;
        private BigDecimal sales;
        private BigDecimal profit;
        private int transactions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySales {
        private Long categoryId;
        private String categoryName;
        private BigDecimal sales;
        private int itemsSold;
        private Double percentageOfTotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HourlySales {
        private int hour;
        private BigDecimal sales;
        private int transactions;
        private BigDecimal averageOrderValue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductPerformance {
        private Long productId;
        private String productName;
        private String category;
        private int quantitySold;
        private BigDecimal revenue;
        private BigDecimal profit;
        private Double profitMargin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffPerformance {
        private Long userId;
        private String staffName;
        private int transactionsHandled;
        private BigDecimal totalSales;
        private BigDecimal averageOrderValue;
    }
}