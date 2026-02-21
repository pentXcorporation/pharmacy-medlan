package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive Product Report Service
 * Covers: product performance, category analysis, margin analysis, batch tracking, pricing
 */
public interface ProductReportService {

    // ===================== PRODUCT PERFORMANCE =====================

    /** Top selling products by quantity sold */
    List<Map<String, Object>> getTopSellingProductsByQuantity(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Top selling products by revenue */
    List<Map<String, Object>> getTopSellingProductsByRevenue(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Slowest moving products (least sold) */
    List<Map<String, Object>> getSlowestMovingProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Never sold products in the period */
    List<Map<String, Object>> getNeverSoldProducts(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Sales velocity per product (average daily sales) */
    List<Map<String, Object>> getProductSalesVelocity(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== CATEGORY ANALYSIS =====================

    /** Sales performance by category */
    List<Map<String, Object>> getSalesByCategory(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Sales performance by sub-category */
    List<Map<String, Object>> getSalesBySubCategory(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Stock value by category */
    Map<String, Object> getStockAnalysisByCategory(Long branchId);

    /** Product count and status breakdown by category */
    List<Map<String, Object>> getProductCountByCategory(Long branchId);

    // ===================== MARGIN & PROFITABILITY ANALYSIS =====================

    /** Gross margin per product */
    List<Map<String, Object>> getProductMarginReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Highest margin products */
    List<Map<String, Object>> getHighestMarginProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Lowest margin / loss-making products */
    List<Map<String, Object>> getLowestMarginProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Profit contribution by product (contribution % to total profit) */
    List<Map<String, Object>> getProductProfitContribution(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== PRICING & RETURNS =====================

    /** Products with high return rates */
    List<Map<String, Object>> getHighReturnRateProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Discount analysis per product */
    List<Map<String, Object>> getProductDiscountAnalysis(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Products sorted by price range */
    Map<String, List<Map<String, Object>>> getProductsByPriceRange(Long branchId);

    // ===================== BATCH & EXPIRY TRACKING =====================

    /** Full batch-wise inventory report per product */
    List<Map<String, Object>> getProductBatchReport(Long branchId);

    /** Products with multiple active batches (FIFO compliance check) */
    List<Map<String, Object>> getMultiBatchProducts(Long branchId);

    /** Expiry loss projection (value of stock expiring in next N days) */
    Map<String, Object> getExpiryLossProjection(Long branchId, int days);

    // ===================== PRODUCT MASTER =====================

    /** Full product catalog with all details */
    List<Map<String, Object>> getProductMasterReport(Long branchId);

    /** Product activity summary: created, modified, discontinued */
    Map<String, Object> getProductActivitySummary(Long branchId);
}