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
}
