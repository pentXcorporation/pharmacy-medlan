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
 * Inventory analytics response for dashboard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAnalyticsResponse {

    /**
     * Branch information
     */
    private Long branchId;
    private String branchName;

    /**
     * Overall inventory metrics
     */
    private int totalProducts;
    private int totalBatches;
    private BigDecimal totalStockValue;
    private BigDecimal totalCostValue;
    private BigDecimal potentialProfit;

    /**
     * Stock status breakdown
     */
    private int inStockCount;
    private int lowStockCount;
    private int outOfStockCount;
    private int overstockCount;

    /**
     * Expiry analysis
     */
    private int expiredCount;
    private int expiringIn7Days;
    private int expiringIn30Days;
    private int expiringIn90Days;
    private BigDecimal expiredValue;
    private BigDecimal expiringValue;

    /**
     * Category-wise stock
     */
    private List<CategoryStock> categoryStockBreakdown;

    /**
     * Stock movement analysis
     */
    private List<StockMovement> recentStockMovements;

    /**
     * ABC analysis
     */
    private AbcAnalysis abcAnalysis;

    /**
     * Inventory turnover metrics
     */
    private BigDecimal inventoryTurnoverRatio;
    private int averageDaysToSell;
    private BigDecimal stockoutRate;

    /**
     * Dead stock analysis
     */
    private int deadStockCount;
    private BigDecimal deadStockValue;

    /**
     * Value distribution
     */
    private Map<String, BigDecimal> stockValueBySchedule;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStock {
        private Long categoryId;
        private String categoryName;
        private int productCount;
        private int totalQuantity;
        private BigDecimal stockValue;
        private int lowStockCount;
        private int expiringCount;
        private Double percentageOfTotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockMovement {
        private LocalDate date;
        private String type; // GRN, SALE, ADJUSTMENT, TRANSFER
        private String reference;
        private int quantity;
        private BigDecimal value;
        private String productName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AbcAnalysis {
        /**
         * A Items: Top 20% products contributing 80% revenue
         */
        private int aItemsCount;
        private BigDecimal aItemsValue;

        /**
         * B Items: Next 30% products contributing 15% revenue
         */
        private int bItemsCount;
        private BigDecimal bItemsValue;

        /**
         * C Items: Bottom 50% products contributing 5% revenue
         */
        private int cItemsCount;
        private BigDecimal cItemsValue;
    }
}