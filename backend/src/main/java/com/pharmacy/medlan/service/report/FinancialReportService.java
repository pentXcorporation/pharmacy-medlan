package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FinancialReportService {
    
    // Revenue reports
    BigDecimal getTotalRevenue(Long branchId, LocalDate startDate, LocalDate endDate);
    Map<String, BigDecimal> getRevenueByCategory(Long branchId, LocalDate startDate, LocalDate endDate);
    Map<String, BigDecimal> getDailyRevenue(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Expense reports
    BigDecimal getTotalExpenses(Long branchId, LocalDate startDate, LocalDate endDate);
    Map<String, BigDecimal> getExpensesByCategory(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Profit reports
    Map<String, Object> getProfitAndLossReport(Long branchId, LocalDate startDate, LocalDate endDate);
    BigDecimal getGrossProfit(Long branchId, LocalDate startDate, LocalDate endDate);
    BigDecimal getNetProfit(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Cash flow
    Map<String, Object> getCashFlowReport(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Receivables and Payables
    BigDecimal getTotalReceivables(Long branchId);
    BigDecimal getTotalPayables(Long branchId);
    List<Map<String, Object>> getAgeingReport(Long branchId, String type); // type: receivables or payables
    
    // Tax reports
    Map<String, BigDecimal> getTaxSummary(Long branchId, LocalDate startDate, LocalDate endDate);
}
