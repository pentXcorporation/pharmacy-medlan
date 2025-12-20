package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface InventoryReportService {
    
    // Stock value reports
    BigDecimal getTotalStockValue(Long branchId);
    Map<String, BigDecimal> getStockValueByCategory(Long branchId);
    
    // Stock movement reports
    List<Map<String, Object>> getStockMovementReport(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Low stock and expiry reports
    List<Map<String, Object>> getLowStockReport(Long branchId);
    List<Map<String, Object>> getExpiringStockReport(Long branchId, int daysToExpiry);
    List<Map<String, Object>> getExpiredStockReport(Long branchId);
    
    // Stock turnover analysis
    Map<String, Object> getStockTurnoverReport(Long branchId, LocalDate startDate, LocalDate endDate);
    
    // Dead stock report
    List<Map<String, Object>> getDeadStockReport(Long branchId, int daysSinceLastSale);
    
    // Stock summary
    Map<String, Object> getInventorySummary(Long branchId);
}
