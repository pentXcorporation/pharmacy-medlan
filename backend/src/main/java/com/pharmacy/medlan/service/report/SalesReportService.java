package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SalesReportService {

    BigDecimal getTotalSales(Long branchId, LocalDate startDate, LocalDate endDate);

    Long getSalesCount(Long branchId, LocalDate startDate, LocalDate endDate);

    List<SaleResponse> getSalesReport(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, BigDecimal> getDailySalesSummary(Long branchId, LocalDate startDate, LocalDate endDate);

    List<Map<String, Object>> getTopSellingProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    List<Map<String, Object>> getSalesByPaymentMethod(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getSalesComparison(Long branchId, LocalDate startDate1, LocalDate endDate1, 
                                            LocalDate startDate2, LocalDate endDate2);

    // Enhanced Sales Analytics
    Map<String, BigDecimal> getHourlySalesDistribution(Long branchId, LocalDate date);

    Map<String, BigDecimal> getSalesByDayOfWeek(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, BigDecimal> getWeeklySalesSummary(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, BigDecimal> getMonthlySalesSummary(Long branchId, int months);

    Map<String, Object> getSalesTrendAnalysis(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getFullSalesDashboard(Long branchId, LocalDate startDate, LocalDate endDate);

    // Customer Analytics
    List<Map<String, Object>> getTopCustomers(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    List<Map<String, Object>> getCustomerPurchaseFrequency(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getNewVsReturningCustomers(Long branchId, LocalDate startDate, LocalDate endDate);

    // Returns & Discounts
    Map<String, Object> getSalesReturnSummary(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, BigDecimal> getDailyReturnsTrend(Long branchId, LocalDate startDate, LocalDate endDate);

    Map<String, Object> getDiscountAnalysisSummary(Long branchId, LocalDate startDate, LocalDate endDate);
}
