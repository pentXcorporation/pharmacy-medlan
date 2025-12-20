package com.pharmacy.medlan.service.report;

import java.util.List;
import java.util.Map;

public interface AlertService {
    
    // Stock alerts
    List<Map<String, Object>> getLowStockAlerts(Long branchId);
    List<Map<String, Object>> getOutOfStockAlerts(Long branchId);
    List<Map<String, Object>> getExpiryAlerts(Long branchId, int daysThreshold);
    
    // Financial alerts
    List<Map<String, Object>> getOverdueInvoiceAlerts(Long branchId);
    List<Map<String, Object>> getOverduePaymentAlerts(Long branchId);
    
    // System alerts
    List<Map<String, Object>> getPendingApprovalAlerts(Long branchId);
    List<Map<String, Object>> getRecentActivityAlerts(Long branchId, int limit);
    
    // Consolidated alerts
    Map<String, Object> getAllAlerts(Long branchId);
    int getAlertCount(Long branchId);
    
    // Mark as read/acknowledged
    void acknowledgeAlert(Long alertId);
    void acknowledgeAllAlerts(Long branchId, String alertType);
}
