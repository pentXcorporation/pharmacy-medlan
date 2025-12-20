package com.pharmacy.medlan.dto.response.dashboard;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private TodaySummary todaySummary;
    private MonthlySummary monthlySummary;
    private InventoryAlerts inventoryAlerts;
    private List<RecentSale> recentSales;
    private List<TopProduct> topSellingProducts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TodaySummary {
        private BigDecimal totalSales;
        private Long salesCount;
        private BigDecimal totalPurchases;
        private Long purchasesCount;
        private BigDecimal profit;
        private Long newCustomers;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlySummary {
        private BigDecimal totalSales;
        private Long salesCount;
        private BigDecimal totalPurchases;
        private BigDecimal totalProfit;
        private BigDecimal averageDailySales;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryAlerts {
        private Long lowStockCount;
        private Long outOfStockCount;
        private Long expiringCount;
        private Long expiredCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentSale {
        private Long id;
        private String saleNumber;
        private String customerName;
        private BigDecimal totalAmount;
        private String status;
        private String saleTime;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProduct {
        private Long productId;
        private String productName;
        private String productCode;
        private Long quantitySold;
        private BigDecimal revenue;
    }
}
