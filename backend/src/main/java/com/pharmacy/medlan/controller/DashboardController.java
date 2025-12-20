package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.dashboard.DashboardSummaryResponse;
import com.pharmacy.medlan.repository.inventory.GRNRepository;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard APIs")
public class DashboardController {

    private final SaleRepository saleRepository;
    private final GRNRepository grnRepository;
    private final CustomerRepository customerRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final InventoryBatchRepository inventoryBatchRepository;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @RequestParam Long branchId) {

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        LocalDate expiryAlertDate = LocalDate.now().plusDays(30);

        // Today's summary
        BigDecimal todaySales = saleRepository.getTotalSalesByBranchAndDate(branchId, startOfDay, endOfDay);
        Long todaySalesCount = (long) saleRepository.findByBranchAndDateRange(branchId, startOfDay, endOfDay).size();
        BigDecimal todayPurchases = grnRepository.getTotalReceiptsByBranch(branchId, LocalDate.now(), LocalDate.now());

        DashboardSummaryResponse.TodaySummary todaySummary = DashboardSummaryResponse.TodaySummary.builder()
                .totalSales(todaySales != null ? todaySales : BigDecimal.ZERO)
                .salesCount(todaySalesCount)
                .totalPurchases(todayPurchases != null ? todayPurchases : BigDecimal.ZERO)
                .purchasesCount(0L)
                .profit(BigDecimal.ZERO)
                .newCustomers(0L)
                .build();

        // Monthly summary
        BigDecimal monthlySales = saleRepository.getTotalSalesByBranchAndDate(
                branchId, startOfMonth.atStartOfDay(), endOfMonth.atTime(LocalTime.MAX));

        DashboardSummaryResponse.MonthlySummary monthlySummary = DashboardSummaryResponse.MonthlySummary.builder()
                .totalSales(monthlySales != null ? monthlySales : BigDecimal.ZERO)
                .salesCount(0L)
                .totalPurchases(BigDecimal.ZERO)
                .totalProfit(BigDecimal.ZERO)
                .averageDailySales(BigDecimal.ZERO)
                .build();

        // Inventory alerts
        Long lowStockCount = (long) branchInventoryRepository.findLowStockByBranch(branchId).size();
        Long outOfStockCount = (long) branchInventoryRepository.findOutOfStockByBranch(branchId).size();
        Long expiringCount = (long) inventoryBatchRepository.findExpiringBatchesForAlert(branchId, expiryAlertDate).size();
        Long expiredCount = (long) inventoryBatchRepository.findExpiredBatches(LocalDate.now()).size();

        DashboardSummaryResponse.InventoryAlerts alerts = DashboardSummaryResponse.InventoryAlerts.builder()
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .expiringCount(expiringCount)
                .expiredCount(expiredCount)
                .build();

        DashboardSummaryResponse response = DashboardSummaryResponse.builder()
                .todaySummary(todaySummary)
                .monthlySummary(monthlySummary)
                .inventoryAlerts(alerts)
                .recentSales(List.of())
                .topSellingProducts(List.of())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/sales-chart")
    @Operation(summary = "Get sales chart data")
    public ResponseEntity<ApiResponse<List<Object>>> getSalesChartData(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "7") int days) {
        // Return placeholder for now - can be implemented with more detail
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }
}
