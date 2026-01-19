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
@Tag(name = "Reports", description = "Reporting APIs for sales, inventory, and financials")
public class ReportController {

    private final SalesReportService salesReportService;
    private final InventoryReportService inventoryReportService;
    private final FinancialReportService financialReportService;
    private final AlertService alertService;

    // ===================== SALES REPORTS =====================

    @GetMapping("/sales/total")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get total sales", description = "Get total sales amount for a date range")
    public ResponseEntity<BigDecimal> getTotalSales(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getTotalSales(branchId, startDate, endDate));
    }

    @GetMapping("/sales/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get sales count", description = "Get number of sales for a date range")
    public ResponseEntity<Long> getSalesCount(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesCount(branchId, startDate, endDate));
    }

    @GetMapping("/sales/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get sales report", description = "Get detailed sales report for a date range")
    public ResponseEntity<List<SaleResponse>> getSalesReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesReport(branchId, startDate, endDate));
    }

    @GetMapping("/sales/daily")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get daily sales summary", description = "Get daily sales breakdown for a date range")
    public ResponseEntity<Map<String, BigDecimal>> getDailySalesSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getDailySalesSummary(branchId, startDate, endDate));
    }

    @GetMapping("/sales/top-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get top selling products", description = "Get top selling products for a date range")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(salesReportService.getTopSellingProducts(branchId, startDate, endDate, limit));
    }

    @GetMapping("/sales/by-payment-method")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get sales by payment method", description = "Get sales breakdown by payment method")
    public ResponseEntity<List<Map<String, Object>>> getSalesByPaymentMethod(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesReportService.getSalesByPaymentMethod(branchId, startDate, endDate));
    }

    @GetMapping("/sales/comparison")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Compare sales periods", description = "Compare sales between two periods")
    public ResponseEntity<Map<String, Object>> getSalesComparison(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate1,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate1,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate2,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate2) {
        return ResponseEntity.ok(salesReportService.getSalesComparison(branchId, startDate1, endDate1, startDate2, endDate2));
    }

    // ===================== INVENTORY REPORTS =====================

    @GetMapping("/inventory/stock-value")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get total stock value", description = "Get total value of inventory stock")
    public ResponseEntity<BigDecimal> getTotalStockValue(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getTotalStockValue(branchId));
    }

    @GetMapping("/inventory/stock-value/by-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get stock value by category", description = "Get stock value breakdown by category")
    public ResponseEntity<Map<String, BigDecimal>> getStockValueByCategory(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getStockValueByCategory(branchId));
    }

    @GetMapping("/inventory/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get low stock report", description = "Get products with low stock levels")
    public ResponseEntity<List<Map<String, Object>>> getLowStockReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getLowStockReport(branchId));
    }

    @GetMapping("/inventory/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get expiring stock report", description = "Get products expiring within days threshold")
    public ResponseEntity<List<Map<String, Object>>> getExpiringStockReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "30") int daysToExpiry) {
        return ResponseEntity.ok(inventoryReportService.getExpiringStockReport(branchId, daysToExpiry));
    }

    @GetMapping("/inventory/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get expired stock report", description = "Get all expired products")
    public ResponseEntity<List<Map<String, Object>>> getExpiredStockReport(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getExpiredStockReport(branchId));
    }

    @GetMapping("/inventory/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get inventory summary", description = "Get overall inventory summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryReportService.getInventorySummary(branchId));
    }

    @GetMapping("/inventory/dead-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get dead stock report", description = "Get products with no recent sales")
    public ResponseEntity<List<Map<String, Object>>> getDeadStockReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "90") int daysSinceLastSale) {
        return ResponseEntity.ok(inventoryReportService.getDeadStockReport(branchId, daysSinceLastSale));
    }

    // ===================== FINANCIAL REPORTS =====================

    @GetMapping("/financial/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get total revenue", description = "Get total revenue for a date range")
    public ResponseEntity<BigDecimal> getTotalRevenue(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getTotalRevenue(branchId, startDate, endDate));
    }

    @GetMapping("/financial/daily-revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get daily revenue", description = "Get daily revenue breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getDailyRevenue(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getDailyRevenue(branchId, startDate, endDate));
    }

    @GetMapping("/financial/profit-loss")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get profit and loss report", description = "Get comprehensive P&L report")
    public ResponseEntity<Map<String, Object>> getProfitAndLossReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getProfitAndLossReport(branchId, startDate, endDate));
    }

    @GetMapping("/financial/cash-flow")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get cash flow report", description = "Get cash flow analysis")
    public ResponseEntity<Map<String, Object>> getCashFlowReport(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getCashFlowReport(branchId, startDate, endDate));
    }

    @GetMapping("/financial/receivables")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get total receivables", description = "Get total outstanding receivables")
    public ResponseEntity<BigDecimal> getTotalReceivables(@RequestParam Long branchId) {
        return ResponseEntity.ok(financialReportService.getTotalReceivables(branchId));
    }

    @GetMapping("/financial/ageing")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get ageing report", description = "Get receivables/payables ageing analysis")
    public ResponseEntity<List<Map<String, Object>>> getAgeingReport(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "receivables") String type) {
        return ResponseEntity.ok(financialReportService.getAgeingReport(branchId, type));
    }

    @GetMapping("/financial/tax-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get tax summary", description = "Get tax collection summary")
    public ResponseEntity<Map<String, BigDecimal>> getTaxSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getTaxSummary(branchId, startDate, endDate));
    }
    
    @GetMapping("/financial/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    @Operation(summary = "Get comprehensive financial summary", description = "Get complete financial overview including revenue, expenses, profitability, and cash flow")
    public ResponseEntity<Map<String, Object>> getFinancialSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(financialReportService.getFinancialSummary(branchId, startDate, endDate));
    }

    // ===================== ALERTS =====================

    @GetMapping("/alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get all alerts", description = "Get all system alerts for a branch")
    public ResponseEntity<Map<String, Object>> getAllAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getAllAlerts(branchId));
    }

    @GetMapping("/alerts/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get alert count", description = "Get total number of active alerts")
    public ResponseEntity<Integer> getAlertCount(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getAlertCount(branchId));
    }

    @GetMapping("/alerts/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get low stock alerts", description = "Get low stock warnings")
    public ResponseEntity<List<Map<String, Object>>> getLowStockAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getLowStockAlerts(branchId));
    }

    @GetMapping("/alerts/expiry")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get expiry alerts", description = "Get expiring product warnings")
    public ResponseEntity<List<Map<String, Object>>> getExpiryAlerts(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "30") int daysThreshold) {
        return ResponseEntity.ok(alertService.getExpiryAlerts(branchId, daysThreshold));
    }

    @GetMapping("/alerts/overdue-invoices")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get overdue invoice alerts", description = "Get overdue invoice warnings")
    public ResponseEntity<List<Map<String, Object>>> getOverdueInvoiceAlerts(@RequestParam Long branchId) {
        return ResponseEntity.ok(alertService.getOverdueInvoiceAlerts(branchId));
    }

    @PostMapping("/alerts/{alertId}/acknowledge")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Acknowledge alert", description = "Mark an alert as acknowledged")
    public ResponseEntity<Void> acknowledgeAlert(@PathVariable Long alertId) {
        alertService.acknowledgeAlert(alertId);
        return ResponseEntity.ok().build();
    }
}
