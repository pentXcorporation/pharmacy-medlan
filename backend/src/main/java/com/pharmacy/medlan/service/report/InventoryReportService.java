package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Enhanced Inventory Report Service
 */
public interface InventoryReportService {

    // ===================== STOCK VALUE =====================
    BigDecimal getTotalStockValue(Long branchId);
    Map<String, BigDecimal> getStockValueByCategory(Long branchId);

    // ===================== STOCK MOVEMENT =====================
    List<Map<String, Object>> getStockMovementReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** GRN-based purchase vs sales comparison per product */
    List<Map<String, Object>> getStockInVsOutReport(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== ALERTS =====================
    List<Map<String, Object>> getLowStockReport(Long branchId);
    List<Map<String, Object>> getExpiringStockReport(Long branchId, int daysToExpiry);
    List<Map<String, Object>> getExpiredStockReport(Long branchId);

    // ===================== TURNOVER =====================
    Map<String, Object> getStockTurnoverReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Per-product stock turnover ratio */
    List<Map<String, Object>> getProductStockTurnoverRatios(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== DEAD STOCK =====================
    List<Map<String, Object>> getDeadStockReport(Long branchId, int daysSinceLastSale);

    // ===================== BATCH ANALYSIS =====================

    /** Valuation report: products valued at purchase price per batch (FIFO) */
    List<Map<String, Object>> getInventoryValuationReport(Long branchId);

    /** Batch aging: how old is the current stock */
    List<Map<String, Object>> getBatchAgingReport(Long branchId);

    // ===================== CROSS-BRANCH =====================

    /** Compare inventory levels across all branches (Super Admin) */
    List<Map<String, Object>> getCrossBranchInventoryComparison();

    /** Stock transfer summary between branches */
    Map<String, Object> getStockTransferSummary(LocalDate startDate, LocalDate endDate);

    // ===================== SUMMARY =====================
    Map<String, Object> getInventorySummary(Long branchId);

    /** Full inventory health dashboard */
    Map<String, Object> getInventoryHealthDashboard(Long branchId);
}