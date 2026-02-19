package com.pharmacy.medlan.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySalesSummaryResponse {

    private Long id;
    private LocalDate summaryDate;
    private Long branchId;
    private String branchName;
    private Integer totalSalesCount;
    private BigDecimal totalSalesAmount;
    private BigDecimal totalCost;
    private BigDecimal totalProfit;
    private BigDecimal totalDiscount;
    private BigDecimal cashSales;
    private BigDecimal cardSales;
    private BigDecimal creditSales;
}
