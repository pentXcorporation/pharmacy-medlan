package com.pharmacy.medlan.controller.dashboard;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.dashboard.BranchAnalyticsResponse;
import com.pharmacy.medlan.dto.response.dashboard.SuperAdminDashboardResponse;
import com.pharmacy.medlan.dto.response.dashboard.SystemMetricsResponse;
import com.pharmacy.medlan.service.dashboard.SuperAdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Super Admin Dashboard
 * Provides real-time dashboard metrics and analytics
 */
@Slf4j
@RestController
@RequestMapping("/api/dashboard/super-admin")
@RequiredArgsConstructor
@Tag(name = "Super Admin Dashboard", description = "Real-time dashboard APIs for Super Admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminDashboardController {

    private final SuperAdminDashboardService dashboardService;

    /**
     * Get complete dashboard data
     * Includes system health, business metrics, top performing branches,
     * recent activities, inventory overview, user statistics, and financial summary
     */
    @GetMapping
    @Operation(
            summary = "Get Super Admin Dashboard",
            description = "Retrieves complete dashboard data with all metrics and analytics in real-time"
    )
    public ResponseEntity<ApiResponse<SuperAdminDashboardResponse>> getDashboard() {
        log.info("Fetching Super Admin Dashboard data");
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("Dashboard data retrieved successfully", dashboard)
        );
    }

    /**
     * Get system health metrics
     * Provides real-time system health information including uptime,
     * response time, active users, database connections, and resource usage
     */
    @GetMapping("/system-metrics")
    @Operation(
            summary = "Get System Metrics",
            description = "Retrieves real-time system health and performance metrics"
    )
    public ResponseEntity<ApiResponse<SystemMetricsResponse>> getSystemMetrics() {
        log.info("Fetching system metrics");
        SystemMetricsResponse metrics = dashboardService.getSystemMetrics();
        return ResponseEntity.ok(
                ApiResponse.success("System metrics retrieved successfully", metrics)
        );
    }

    /**
     * Get branch analytics
     * Provides comprehensive analytics for all branches including
     * sales performance, order metrics, inventory status, and rankings
     */
    @GetMapping("/branch-analytics")
    @Operation(
            summary = "Get Branch Analytics",
            description = "Retrieves comprehensive analytics for all branches with performance comparisons"
    )
    public ResponseEntity<ApiResponse<BranchAnalyticsResponse>> getBranchAnalytics() {
        log.info("Fetching branch analytics");
        BranchAnalyticsResponse analytics = dashboardService.getBranchAnalytics();
        return ResponseEntity.ok(
                ApiResponse.success("Branch analytics retrieved successfully", analytics)
        );
    }

    /**
     * Get business metrics
     * Provides business-level metrics including sales, orders, and growth rates
     */
    @GetMapping("/business-metrics")
    @Operation(
            summary = "Get Business Metrics",
            description = "Retrieves real-time business metrics including sales and order statistics"
    )
    public ResponseEntity<ApiResponse<SuperAdminDashboardResponse.BusinessMetrics>> getBusinessMetrics() {
        log.info("Fetching business metrics");
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("Business metrics retrieved successfully", dashboard.getBusinessMetrics())
        );
    }

    /**
     * Get inventory overview
     * Provides system-wide inventory status including stock levels and alerts
     */
    @GetMapping("/inventory-overview")
    @Operation(
            summary = "Get Inventory Overview",
            description = "Retrieves system-wide inventory status and alerts"
    )
    public ResponseEntity<ApiResponse<SuperAdminDashboardResponse.InventoryOverview>> getInventoryOverview() {
        log.info("Fetching inventory overview");
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("Inventory overview retrieved successfully", dashboard.getInventoryOverview())
        );
    }

    /**
     * Get user statistics
     * Provides user-related statistics including active users, roles, and recent additions
     */
    @GetMapping("/user-statistics")
    @Operation(
            summary = "Get User Statistics",
            description = "Retrieves comprehensive user statistics across the system"
    )
    public ResponseEntity<ApiResponse<SuperAdminDashboardResponse.UserStatistics>> getUserStatistics() {
        log.info("Fetching user statistics");
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("User statistics retrieved successfully", dashboard.getUserStatistics())
        );
    }

    /**
     * Get financial summary
     * Provides financial overview including revenue, expenses, and profitability
     */
    @GetMapping("/financial-summary")
    @Operation(
            summary = "Get Financial Summary",
            description = "Retrieves financial summary including revenue, expenses, and profit margins"
    )
    public ResponseEntity<ApiResponse<SuperAdminDashboardResponse.FinancialSummary>> getFinancialSummary() {
        log.info("Fetching financial summary");
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("Financial summary retrieved successfully", dashboard.getFinancialSummary())
        );
    }

    /**
     * Get recent activities
     * Provides a stream of recent system activities across all branches
     */
    @GetMapping("/recent-activities")
    @Operation(
            summary = "Get Recent Activities",
            description = "Retrieves recent system activities across all branches"
    )
    public ResponseEntity<ApiResponse<java.util.List<SuperAdminDashboardResponse.RecentActivity>>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("Fetching recent activities with limit: {}", limit);
        SuperAdminDashboardResponse dashboard = dashboardService.getDashboardData();
        return ResponseEntity.ok(
                ApiResponse.success("Recent activities retrieved successfully", dashboard.getRecentActivities())
        );
    }

    /**
     * Health check endpoint
     * Simple endpoint to verify the API is responsive
     */
    @GetMapping("/health")
    @Operation(
            summary = "Health Check",
            description = "Simple health check endpoint to verify API availability"
    )
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("Super Admin Dashboard API is healthy", "OK")
        );
    }
}
