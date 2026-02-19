package com.pharmacy.medlan.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialReportResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private Long branchId;
    private String branchName;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal grossProfit;
    private BigDecimal netProfit;
    private BigDecimal totalSalesAmount;
    private BigDecimal totalPurchaseAmount;
    private BigDecimal totalPayrollAmount;
    private BigDecimal totalCashIn;
    private BigDecimal totalCashOut;
    private Integer totalSalesCount;
    private Integer totalPurchaseCount;
    private List<CategoryBreakdown> categoryBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryBreakdown {
        private String category;
        private BigDecimal amount;
        private Integer count;
        private BigDecimal percentage;
    }
}
