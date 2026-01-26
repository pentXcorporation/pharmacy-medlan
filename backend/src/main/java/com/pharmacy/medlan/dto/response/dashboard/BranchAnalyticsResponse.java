package com.pharmacy.medlan.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for Branch Analytics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchAnalyticsResponse {
    private List<BranchPerformanceDetail> branches;
    private BranchComparisonSummary summary;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchPerformanceDetail {
        private Long branchId;
        private String branchName;
        private String branchCode;
        private Boolean isActive;
        private String city;
        private String state;
        
        // Sales metrics
        private BigDecimal todaySales;
        private BigDecimal weekToDateSales;
        private BigDecimal monthToDateSales;
        private BigDecimal yearToDateSales;
        
        // Order metrics
        private Integer todayOrders;
        private Integer weekToDateOrders;
        private Integer monthToDateOrders;
        private Integer yearToDateOrders;
        
        // Growth metrics
        private Double dailyGrowth;
        private Double weeklyGrowth;
        private Double monthlyGrowth;
        
        // Inventory metrics
        private Long totalProducts;
        private Long lowStockItems;
        private Long outOfStockItems;
        
        // User metrics
        private Integer totalStaff;
        private Integer activeStaff;
        
        // Rankings
        private Integer salesRank;
        private Integer ordersRank;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchComparisonSummary {
        private Integer totalBranches;
        private Integer activeBranches;
        private BigDecimal totalSales;
        private Integer totalOrders;
        private BigDecimal averageSalesPerBranch;
        private String topPerformingBranch;
        private String leastPerformingBranch;
    }
}
