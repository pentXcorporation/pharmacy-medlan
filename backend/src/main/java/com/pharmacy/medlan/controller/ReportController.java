package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.service.report.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Comprehensive reporting APIs — Sales, Inventory, Financial, Employee, Product, Supplier")
public class ReportController {

    private final SalesReportService salesReportService;
    private final InventoryReportService inventoryReportService;
    private final FinancialReportService financialReportService;
    private final AlertService alertService;
    private final EmployeeReportService employeeReportService;
    private final ProductReportService productReportService;
    private final SupplierReportService supplierReportService;

    // ========================================================================
    // SECTION 1: CORE SALES REPORTS
    // ========================================================================

    @GetMapping("/sales/total")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Total sales amount for a date range")
    public ResponseEntity<BigDecimal> getTotalSales(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getTotalSales(branchId, startDate, endDate));
    }

    @GetMapping("/sales/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Number of sales transactions for a date range")
    public ResponseEntity<Long> getSalesCount(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesCount(branchId, startDate, endDate));
    }

    @GetMapping("/sales/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Detailed sales records for a date range")
    public ResponseEntity<List<SaleResponse>> getSalesReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesReport(branchId, startDate, endDate));
    }

    @GetMapping("/sales/daily")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Daily sales totals for a date range")
    public ResponseEntity<Map<String, BigDecimal>> getDailySalesSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getDailySalesSummary(branchId, startDate, endDate));
    }

    @GetMapping("/sales/top-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top selling products by revenue")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(salesReportService.getTopSellingProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/sales/by-payment-method")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Sales breakdown by payment method")
    public ResponseEntity<List<Map<String, Object>>> getSalesByPaymentMethod(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesByPaymentMethod(branchId, startDate, endDate));
    }

    @GetMapping("/sales/comparison")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Compare two sales periods")
    public ResponseEntity<Map<String, Object>> getSalesComparison(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate1,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate1,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate2,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate2) {
        return ResponseEntity.ok(salesReportService.getSalesComparison(branchId, startDate1, endDate1, startDate2, endDate2));
    }

    // ========================================================================
    // SECTION 2: ENHANCED SALES ANALYTICS
    // ========================================================================

    @GetMapping("/sales/hourly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Hourly sales distribution for a specific day — identify peak hours")
    public ResponseEntity<Map<String, BigDecimal>> getHourlySalesDistribution(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(salesReportService.getHourlySalesDistribution(branchId, date));
    }

    @GetMapping("/sales/by-day-of-week")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales aggregated by day of week — find busiest days")
    public ResponseEntity<Map<String, BigDecimal>> getSalesByDayOfWeek(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesByDayOfWeek(branchId, startDate, endDate));
    }

    @GetMapping("/sales/weekly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Weekly sales totals")
    public ResponseEntity<Map<String, BigDecimal>> getWeeklySalesSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getWeeklySalesSummary(branchId, startDate, endDate));
    }

    @GetMapping("/sales/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Monthly sales totals for last N months")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlySalesSummary(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(salesReportService.getMonthlySalesSummary(branchId, months));
    }

    @GetMapping("/sales/trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales trend analysis with growth rate calculation")
    public ResponseEntity<Map<String, Object>> getSalesTrendAnalysis(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesTrendAnalysis(branchId, startDate, endDate));
    }

    @GetMapping("/sales/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Full sales dashboard — combines all key sales metrics in one call")
    public ResponseEntity<Map<String, Object>> getFullSalesDashboard(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getFullSalesDashboard(branchId, startDate, endDate));
    }

    // ========================================================================
    // SECTION 3: CUSTOMER ANALYSIS
    // ========================================================================

    @GetMapping("/sales/top-customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top customers by total purchase value")
    public ResponseEntity<List<Map<String, Object>>> getTopCustomers(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(salesReportService.getTopCustomers(branchId, startDate, endDate, limit));
    }

    @GetMapping("/sales/customer-frequency")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Customer purchase frequency analysis")
    public ResponseEntity<List<Map<String, Object>>> getCustomerPurchaseFrequency(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getCustomerPurchaseFrequency(branchId, startDate, endDate));
    }

    @GetMapping("/sales/new-vs-returning-customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "New vs returning customer ratio")
    public ResponseEntity<Map<String, Object>> getNewVsReturningCustomers(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getNewVsReturningCustomers(branchId, startDate, endDate));
    }

    // ========================================================================
    // SECTION 4: RETURNS & DISCOUNT ANALYSIS
    // ========================================================================

    @GetMapping("/sales/returns/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales return summary with return rate")
    public ResponseEntity<Map<String, Object>> getSalesReturnSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesReturnSummary(branchId, startDate, endDate));
    }

    @GetMapping("/sales/returns/daily-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Daily returns trend")
    public ResponseEntity<Map<String, BigDecimal>> getDailyReturnsTrend(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getDailyReturnsTrend(branchId, startDate, endDate));
    }

    @GetMapping("/sales/discounts")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Discount analysis — total given, rate, impact on revenue")
    public ResponseEntity<Map<String, Object>> getDiscountAnalysis(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getDiscountAnalysisSummary(branchId, startDate, endDate));
    }

    // ========================================================================
    // SECTION 5: PRODUCT REPORTS
    // ========================================================================

    @GetMapping("/products/top-by-quantity")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top products by quantity sold")
    public ResponseEntity<List<Map<String, Object>>> getTopProductsByQuantity(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getTopSellingProductsByQuantity(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/top-by-revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top products by revenue")
    public ResponseEntity<List<Map<String, Object>>> getTopProductsByRevenue(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getTopSellingProductsByRevenue(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/slowest-moving")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Slowest moving products")
    public ResponseEntity<List<Map<String, Object>>> getSlowestMovingProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getSlowestMovingProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/never-sold")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Products that were never sold in the period")
    public ResponseEntity<List<Map<String, Object>>> getNeverSoldProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getNeverSoldProducts(branchId, startDate, endDate));
    }

    @GetMapping("/products/sales-velocity")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales velocity per product — average daily units sold")
    public ResponseEntity<List<Map<String, Object>>> getProductSalesVelocity(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getProductSalesVelocity(branchId, startDate, endDate));
    }

    @GetMapping("/products/by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Sales performance grouped by category")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getSalesByCategory(branchId, startDate, endDate));
    }

    @GetMapping("/products/by-sub-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales performance grouped by sub-category")
    public ResponseEntity<List<Map<String, Object>>> getSalesBySubCategory(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getSalesBySubCategory(branchId, startDate, endDate));
    }

    @GetMapping("/products/stock-by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Stock analysis (quantity + value) by category")
    public ResponseEntity<Map<String, Object>> getStockAnalysisByCategory(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getStockAnalysisByCategory(branchId));
    }

    @GetMapping("/products/count-by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Product count and stock status breakdown by category")
    public ResponseEntity<List<Map<String, Object>>> getProductCountByCategory(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getProductCountByCategory(branchId));
    }

    @GetMapping("/products/margins")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Gross margin per product")
    public ResponseEntity<List<Map<String, Object>>> getProductMarginReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getProductMarginReport(branchId, startDate, endDate));
    }

    @GetMapping("/products/highest-margin")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top products by highest gross margin %")
    public ResponseEntity<List<Map<String, Object>>> getHighestMarginProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getHighestMarginProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/lowest-margin")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Products with lowest / negative gross margin")
    public ResponseEntity<List<Map<String, Object>>> getLowestMarginProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getLowestMarginProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/profit-contribution")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Each product's % contribution to total profit")
    public ResponseEntity<List<Map<String, Object>>> getProductProfitContribution(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getProductProfitContribution(branchId, startDate, endDate));
    }

    @GetMapping("/products/high-return-rate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Products with high customer return rates")
    public ResponseEntity<List<Map<String, Object>>> getHighReturnRateProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productReportService.getHighReturnRateProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/products/discount-analysis")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Discount analysis per product")
    public ResponseEntity<List<Map<String, Object>>> getProductDiscountAnalysis(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productReportService.getProductDiscountAnalysis(branchId, startDate, endDate));
    }

    @GetMapping("/products/by-price-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Products grouped by price range")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getProductsByPriceRange(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getProductsByPriceRange(branchId));
    }

    @GetMapping("/products/batch-report")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Full batch-wise inventory per product")
    public ResponseEntity<List<Map<String, Object>>> getProductBatchReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getProductBatchReport(branchId));
    }

    @GetMapping("/products/multi-batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Products with multiple active batches (FIFO compliance check)")
    public ResponseEntity<List<Map<String, Object>>> getMultiBatchProducts(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getMultiBatchProducts(branchId));
    }

    @GetMapping("/products/expiry-loss-projection")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Projected financial loss from expiring stock in next N days")
    public ResponseEntity<Map<String, Object>> getExpiryLossProjection(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(productReportService.getExpiryLossProjection(branchId, days));
    }

    @GetMapping("/products/master")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Full product catalog with stock, pricing, and status details")
    public ResponseEntity<List<Map<String, Object>>> getProductMasterReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getProductMasterReport(branchId));
    }

    @GetMapping("/products/activity-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Product activity summary — active, inactive, stock status counts")
    public ResponseEntity<Map<String, Object>> getProductActivitySummary(@RequestParam Long branchId) {
        return ResponseEntity.ok(productReportService.getProductActivitySummary(branchId));
    }

    // ========================================================================
    // SECTION 6: INVENTORY REPORTS
    // ========================================================================

    @GetMapping("/inventory/stock-value")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Total inventory stock value")
    public ResponseEntity<BigDecimal> getTotalStockValue(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getTotalStockValue(branchId));
    }

    @GetMapping("/inventory/stock-value/by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Stock value broken down by category")
    public ResponseEntity<Map<String, BigDecimal>> getStockValueByCategory(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getStockValueByCategory(branchId));
    }

    @GetMapping("/inventory/stock-movement")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Stock movement (in vs out) per product for a date range")
    public ResponseEntity<List<Map<String, Object>>> getStockMovementReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(inventoryReportService.getStockMovementReport(branchId, startDate, endDate));
    }

    @GetMapping("/inventory/stock-in-vs-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Stock in vs out comparison — sorted by largest net movement")
    public ResponseEntity<List<Map<String, Object>>> getStockInVsOutReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(inventoryReportService.getStockInVsOutReport(branchId, startDate, endDate));
    }

    @GetMapping("/inventory/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Products with low stock levels")
    public ResponseEntity<List<Map<String, Object>>> getLowStockReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getLowStockReport(branchId));
    }

    @GetMapping("/inventory/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Products expiring within N days")
    public ResponseEntity<List<Map<String, Object>>> getExpiringStockReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "30") int daysToExpiry) {
        return ResponseEntity.ok(inventoryReportService.getExpiringStockReport(branchId, daysToExpiry));
    }

    @GetMapping("/inventory/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "All expired products with loss value")
    public ResponseEntity<List<Map<String, Object>>> getExpiredStockReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getExpiredStockReport(branchId));
    }

    @GetMapping("/inventory/turnover")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Overall stock turnover ratio and days-in-inventory")
    public ResponseEntity<Map<String, Object>> getStockTurnoverReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(inventoryReportService.getStockTurnoverReport(branchId, startDate, endDate));
    }

    @GetMapping("/inventory/turnover/by-product")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Stock turnover ratio per product")
    public ResponseEntity<List<Map<String, Object>>> getProductStockTurnoverRatios(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(inventoryReportService.getProductStockTurnoverRatios(branchId, startDate, endDate));
    }

    @GetMapping("/inventory/dead-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Products with no sales in last N days (dead stock)")
    public ResponseEntity<List<Map<String, Object>>> getDeadStockReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "90") int daysSinceLastSale) {
        return ResponseEntity.ok(inventoryReportService.getDeadStockReport(branchId, daysSinceLastSale));
    }

    @GetMapping("/inventory/valuation")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "FIFO inventory valuation — purchase vs selling value with unrealized profit")
    public ResponseEntity<List<Map<String, Object>>> getInventoryValuationReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getInventoryValuationReport(branchId));
    }

    @GetMapping("/inventory/batch-aging")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Batch aging report — how long stock has been sitting")
    public ResponseEntity<List<Map<String, Object>>> getBatchAgingReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getBatchAgingReport(branchId));
    }

    @GetMapping("/inventory/cross-branch")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Inventory comparison across all branches (Super Admin)")
    public ResponseEntity<List<Map<String, Object>>> getCrossBranchInventoryComparison() {
        return ResponseEntity.ok(inventoryReportService.getCrossBranchInventoryComparison());
    }

    @GetMapping("/inventory/stock-transfer-summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Summary of stock transfers between branches")
    public ResponseEntity<Map<String, Object>> getStockTransferSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(inventoryReportService.getStockTransferSummary(startDate, endDate));
    }

    @GetMapping("/inventory/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Overall inventory summary with counts and values")
    public ResponseEntity<Map<String, Object>> getInventorySummary(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getInventorySummary(branchId));
    }

    @GetMapping("/inventory/health-dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Full inventory health dashboard — all critical inventory metrics in one call")
    public ResponseEntity<Map<String, Object>> getInventoryHealthDashboard(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getInventoryHealthDashboard(branchId));
    }

    // ========================================================================
    // SECTION 7: FINANCIAL REPORTS
    // ========================================================================

    @GetMapping("/financial/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Total revenue for a date range")
    public ResponseEntity<BigDecimal> getTotalRevenue(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getTotalRevenue(branchId, startDate, endDate));
    }

    @GetMapping("/financial/daily-revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Daily revenue breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getDailyRevenue(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getDailyRevenue(branchId, startDate, endDate));
    }

    @GetMapping("/financial/revenue-by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Revenue breakdown by product category")
    public ResponseEntity<Map<String, BigDecimal>> getRevenueByCategory(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getRevenueByCategory(branchId, startDate, endDate));
    }

    @GetMapping("/financial/profit-loss")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Profit and loss report with gross margin")
    public ResponseEntity<Map<String, Object>> getProfitAndLossReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getProfitAndLossReport(branchId, startDate, endDate));
    }

    @GetMapping("/financial/cash-flow")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Cash flow report")
    public ResponseEntity<Map<String, Object>> getCashFlowReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getCashFlowReport(branchId, startDate, endDate));
    }

    @GetMapping("/financial/receivables")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Total outstanding receivables")
    public ResponseEntity<BigDecimal> getTotalReceivables(@RequestParam Long branchId) {
        return ResponseEntity.ok(financialReportService.getTotalReceivables(branchId));
    }

    @GetMapping("/financial/ageing")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Receivables/Payables ageing analysis by bucket (0-30, 31-60, 61-90, 90+ days)")
    public ResponseEntity<List<Map<String, Object>>> getAgeingReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "receivables") String type) {
        return ResponseEntity.ok(financialReportService.getAgeingReport(branchId, type));
    }

    @GetMapping("/financial/tax-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Tax collection summary")
    public ResponseEntity<Map<String, BigDecimal>> getTaxSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getTaxSummary(branchId, startDate, endDate));
    }

    @GetMapping("/financial/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    @Operation(summary = "Comprehensive financial summary — revenue, expenses, profitability, cash flow in one call")
    public ResponseEntity<Map<String, Object>> getFinancialSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getFinancialSummary(branchId, startDate, endDate));
    }

    // ========================================================================
    // SECTION 8: EMPLOYEE REPORTS
    // ========================================================================

    @GetMapping("/employees/attendance-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Attendance summary for all employees in a branch")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceSummaryReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getAttendanceSummaryReport(branchId, startDate, endDate));
    }

    @GetMapping("/employees/{employeeId}/attendance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Detailed attendance record for a specific employee")
    public ResponseEntity<Map<String, Object>> getEmployeeAttendanceDetail(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getEmployeeAttendanceDetail(employeeId, startDate, endDate));
    }

    @GetMapping("/employees/attendance-rate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Attendance rate % per employee — sorted best to worst")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceRateByEmployee(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getAttendanceRateByEmployee(branchId, startDate, endDate));
    }

    @GetMapping("/employees/top-absentees")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Employees with most absences in the period")
    public ResponseEntity<List<Map<String, Object>>> getTopAbsentees(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(employeeReportService.getTopAbsentees(branchId, startDate, endDate, limit));
    }

    @GetMapping("/employees/late-arrivals")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Late arrivals report — which employees came late and when")
    public ResponseEntity<List<Map<String, Object>>> getLateArrivalsReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getLateArrivalsReport(branchId, startDate, endDate));
    }

    @GetMapping("/employees/work-hours")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Average and total work hours per employee")
    public ResponseEntity<List<Map<String, Object>>> getAverageWorkHours(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getAverageWorkHoursByEmployee(branchId, startDate, endDate));
    }

    @GetMapping("/employees/overtime")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Overtime hours per employee")
    public ResponseEntity<List<Map<String, Object>>> getOvertimeReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getOvertimeReport(branchId, startDate, endDate));
    }

    @GetMapping("/employees/payroll-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Payroll summary — total gross, deductions, and net salary for branch")
    public ResponseEntity<Map<String, Object>> getPayrollSummaryReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getPayrollSummaryReport(branchId, startDate, endDate));
    }

    @GetMapping("/employees/payroll-breakdown")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Per-employee payroll breakdown — basic, allowances, deductions, net")
    public ResponseEntity<List<Map<String, Object>>> getEmployeePayrollBreakdown(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getEmployeePayrollBreakdown(branchId, startDate, endDate));
    }

    @GetMapping("/employees/payroll-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Monthly payroll cost trend for last N months")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyPayrollTrend(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(employeeReportService.getMonthlyPayrollTrend(branchId, months));
    }

    @GetMapping("/employees/payroll-by-employment-type")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Payroll cost grouped by employment type (full-time, part-time, contract)")
    public ResponseEntity<Map<String, BigDecimal>> getPayrollByEmploymentType(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getPayrollByEmploymentType(branchId, startDate, endDate));
    }

    @GetMapping("/employees/sales-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Sales performance per employee — who sold the most")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeSalesPerformance(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getEmployeeSalesPerformance(branchId, startDate, endDate));
    }

    @GetMapping("/employees/transaction-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Number of sales transactions handled per employee")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeTransactionCount(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getEmployeeTransactionCount(branchId, startDate, endDate));
    }

    @GetMapping("/employees/top-performers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top performing employees by sales amount")
    public ResponseEntity<List<Map<String, Object>>> getTopPerformingEmployees(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(employeeReportService.getTopPerformingEmployees(branchId, startDate, endDate, limit));
    }

    @GetMapping("/employees/{employeeId}/scorecard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Employee performance scorecard — composite grade from attendance, punctuality, and sales")
    public ResponseEntity<Map<String, Object>> getEmployeeScorecard(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(employeeReportService.getEmployeeScorecard(employeeId, startDate, endDate));
    }

    @GetMapping("/employees/headcount")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Headcount summary — by role, employment type, active/inactive")
    public ResponseEntity<Map<String, Object>> getHeadcountSummary(@RequestParam Long branchId) {
        return ResponseEntity.ok(employeeReportService.getHeadcountSummary(branchId));
    }

    @GetMapping("/employees/tenure")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Employee tenure / length of service distribution")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeTenureReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(employeeReportService.getEmployeeTenureReport(branchId));
    }

    @GetMapping("/employees/salary-distribution")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Salary distribution by role — min, max, average per role")
    public ResponseEntity<Map<String, Object>> getSalaryDistributionReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(employeeReportService.getSalaryDistributionReport(branchId));
    }

    @GetMapping("/employees/master")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Full employee master report with all HR details")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeMasterReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(employeeReportService.getEmployeeMasterReport(branchId));
    }

    // ========================================================================
    // SECTION 9: SUPPLIER REPORTS
    // ========================================================================

    @GetMapping("/suppliers/purchase-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Total purchase summary from all suppliers")
    public ResponseEntity<Map<String, Object>> getPurchaseSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getPurchaseSummary(branchId, startDate, endDate));
    }

    @GetMapping("/suppliers/purchase-by-supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Purchase amounts grouped by supplier")
    public ResponseEntity<List<Map<String, Object>>> getPurchaseBySupplier(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getPurchaseBySupplier(branchId, startDate, endDate));
    }

    @GetMapping("/suppliers/purchase-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Monthly purchase trend from suppliers for last N months")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyPurchaseTrend(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(supplierReportService.getMonthlyPurchaseTrend(branchId, months));
    }

    @GetMapping("/suppliers/top")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Top suppliers by purchase value")
    public ResponseEntity<List<Map<String, Object>>> getTopSuppliers(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(supplierReportService.getTopSuppliersByPurchaseValue(branchId, startDate, endDate, limit));
    }

    @GetMapping("/suppliers/grn-report")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "GRN report — all goods receipts with supplier, amount, and status")
    public ResponseEntity<List<Map<String, Object>>> getGRNReportBySupplier(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getGRNReportBySupplier(branchId, startDate, endDate));
    }

    @GetMapping("/suppliers/payment-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Supplier payment summary — paid, outstanding, credit status per supplier")
    public ResponseEntity<List<Map<String, Object>>> getSupplierPaymentSummary(@RequestParam Long branchId) {
        return ResponseEntity.ok(supplierReportService.getSupplierPaymentSummary(branchId));
    }

    @GetMapping("/suppliers/payables-ageing")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Supplier payables ageing analysis — buckets by age of outstanding amounts")
    public ResponseEntity<List<Map<String, Object>>> getSupplierPayablesAgeing(@RequestParam Long branchId) {
        return ResponseEntity.ok(supplierReportService.getSupplierPayablesAgeing(branchId));
    }

    @GetMapping("/suppliers/{supplierId}/payment-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "Payment history for a specific supplier")
    public ResponseEntity<List<Map<String, Object>>> getSupplierPaymentHistory(
            @PathVariable Long supplierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getSupplierPaymentHistory(supplierId, startDate, endDate));
    }

    @GetMapping("/suppliers/overdue-payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    @Operation(summary = "All overdue supplier payments requiring attention")
    public ResponseEntity<List<Map<String, Object>>> getOverdueSupplierPayments(@RequestParam Long branchId) {
        return ResponseEntity.ok(supplierReportService.getOverdueSupplierPayments(branchId));
    }

    @GetMapping("/suppliers/delivery-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Supplier delivery performance — on-time delivery rate per supplier")
    public ResponseEntity<List<Map<String, Object>>> getSupplierDeliveryPerformance(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getSupplierDeliveryPerformance(branchId, startDate, endDate));
    }

    @GetMapping("/suppliers/return-rate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Supplier return rate — how much stock is returned (RGRN) per supplier")
    public ResponseEntity<List<Map<String, Object>>> getSupplierReturnRateReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getSupplierReturnRateReport(branchId, startDate, endDate));
    }

    @GetMapping("/suppliers/{supplierId}/product-mix")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Products supplied by a specific supplier with quantities and values")
    public ResponseEntity<List<Map<String, Object>>> getSupplierProductMix(
            @PathVariable Long supplierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(supplierReportService.getSupplierProductMix(supplierId, startDate, endDate));
    }

    @GetMapping("/suppliers/master")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Full supplier master report with all details")
    public ResponseEntity<List<Map<String, Object>>> getSupplierMasterReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(supplierReportService.getSupplierMasterReport(branchId));
    }

    // ========================================================================
    // SECTION 10: ALERTS
    // ========================================================================

    @GetMapping("/alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "All system alerts for a branch")
    public ResponseEntity<Map<String, Object>> getAllAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getAllAlerts(branchId));
    }

    @GetMapping("/alerts/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Total active alert count")
    public ResponseEntity<Integer> getAlertCount(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getAlertCount(branchId));
    }

    @GetMapping("/alerts/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Low stock alerts")
    public ResponseEntity<List<Map<String, Object>>> getLowStockAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getLowStockAlerts(branchId));
    }

    @GetMapping("/alerts/expiry")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Expiring product alerts")
    public ResponseEntity<List<Map<String, Object>>> getExpiryAlerts(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "30") int daysThreshold) {
        return ResponseEntity.ok(alertService.getExpiryAlerts(branchId, daysThreshold));
    }

    @GetMapping("/alerts/overdue-invoices")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Overdue invoice alerts")
    public ResponseEntity<List<Map<String, Object>>> getOverdueInvoiceAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getOverdueInvoiceAlerts(branchId));
    }

    @PostMapping("/alerts/{alertId}/acknowledge")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Acknowledge an alert")
    public ResponseEntity<Void> acknowledgeAlert(@PathVariable Long alertId) {
        alertService.acknowledgeAlert(alertId);
        return ResponseEntity.ok().build();
    }
}