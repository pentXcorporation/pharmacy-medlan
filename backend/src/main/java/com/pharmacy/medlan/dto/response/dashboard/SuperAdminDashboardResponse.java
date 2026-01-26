package com.pharmacy.medlan.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for Super Admin Dashboard
 * Contains all real-time metrics and statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminDashboardResponse {
    private SystemHealth systemHealth;
    private BusinessMetrics businessMetrics;
    private List<BranchPerformance> topPerformingBranches;
    private List<RecentActivity> recentActivities;
    private InventoryOverview inventoryOverview;
    private UserStatistics userStatistics;
    private FinancialSummary financialSummary;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemHealth {
        private String status; // HEALTHY, WARNING, CRITICAL
        private Double uptime; // percentage
        private Long responseTime; // in milliseconds
        private Integer activeUsers;
        private Integer activeSessions;
        private Integer dbConnections;
        private Integer maxDbConnections;
        private Double errorRate; // percentage
        private LocalDateTime lastBackup;
        private Long memoryUsage; // in MB
        private Long maxMemory; // in MB
        private Double cpuUsage; // percentage
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BusinessMetrics {
        private BigDecimal todaySales;
        private BigDecimal yesterdaySales;
        private BigDecimal monthToDateSales;
        private BigDecimal yearToDateSales;
        private Integer todayOrders;
        private Integer pendingOrders;
        private Integer completedOrders;
        private BigDecimal averageOrderValue;
        private Double salesGrowthRate; // percentage compared to previous period
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchPerformance {
        private Long branchId;
        private String branchName;
        private String branchCode;
        private BigDecimal todaySales;
        private BigDecimal monthToDateSales;
        private Integer todayOrders;
        private Integer monthToDateOrders;
        private Boolean isActive;
        private Double growthRate; // percentage
        private Integer rank;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String activityType; // SALE, PO, GRN, USER_LOGIN, STOCK_TRANSFER
        private String description;
        private String branchName;
        private String userName;
        private LocalDateTime timestamp;
        private String severity; // INFO, WARNING, CRITICAL
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryOverview {
        private Long totalProducts;
        private Long lowStockItems;
        private Long outOfStockItems;
        private Long expiringItems; // expiring in 30 days
        private Long expiredItems;
        private BigDecimal totalInventoryValue;
        private Integer criticalAlerts;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatistics {
        private Integer totalUsers;
        private Integer activeUsers;
        private Integer loggedInUsers;
        private Integer adminUsers;
        private Integer managerUsers;
        private Integer cashierUsers;
        private Integer recentlyAddedUsers; // in last 7 days
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinancialSummary {
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netProfit;
        private BigDecimal pendingPayments;
        private BigDecimal receivables;
        private BigDecimal payables;
        private Double profitMargin; // percentage
    }
}
