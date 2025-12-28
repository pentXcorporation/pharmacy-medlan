package com.pharmacy.medlan.service.dashboard;

import com.pharmacy.medlan.dto.response.dashboard.DashboardSummaryResponse;
import com.pharmacy.medlan.dto.response.dashboard.SalesAnalyticsResponse;
import com.pharmacy.medlan.dto.response.dashboard.InventoryAnalyticsResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Service interface for dashboard analytics and summaries
 */
public interface DashboardService {
    
    /**
     * Get complete dashboard summary for a branch
     */
    DashboardSummaryResponse getDashboardSummary(Long branchId);
    
    /**
     * Get today's sales summary
     */
    Map<String, Object> getTodaySales(Long branchId);
    
    /**
     * Get sales analytics for a date range
     */
    SalesAnalyticsResponse getSalesAnalytics(Long branchId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get inventory analytics
     */
    InventoryAnalyticsResponse getInventoryAnalytics(Long branchId);
    
    /**
     * Get top selling products
     */
    List<Map<String, Object>> getTopSellingProducts(Long branchId, int limit);
    
    /**
     * Get slow moving products
     */
    List<Map<String, Object>> getSlowMovingProducts(Long branchId, int daysSinceLastSale);
    
    /**
     * Get revenue trends
     */
    Map<String, Object> getRevenueTrends(Long branchId, int days);
    
    /**
     * Get staff performance
     */
    List<Map<String, Object>> getStaffPerformance(Long branchId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get customer insights
     */
    Map<String, Object> getCustomerInsights(Long branchId);
    
    /**
     * Get real-time alerts count
     */
    Map<String, Integer> getAlertCounts(Long branchId);
}
