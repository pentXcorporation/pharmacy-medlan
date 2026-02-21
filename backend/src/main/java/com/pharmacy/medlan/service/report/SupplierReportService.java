package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive Supplier Report Service
 * Covers: purchase analysis, payment status, supplier performance, GRN tracking
 */
public interface SupplierReportService {

    // ===================== PURCHASE REPORTS =====================

    /** Total purchases from all suppliers in a period */
    Map<String, Object> getPurchaseSummary(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Purchase totals grouped by supplier */
    List<Map<String, Object>> getPurchaseBySupplier(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Monthly purchase trend */
    Map<String, BigDecimal> getMonthlyPurchaseTrend(Long branchId, int months);

    /** Top suppliers by purchase value */
    List<Map<String, Object>> getTopSuppliersByPurchaseValue(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** GRN (Goods Receipt Note) report per supplier */
    List<Map<String, Object>> getGRNReportBySupplier(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== PAYMENT REPORTS =====================

    /** Supplier payment summary: total paid, outstanding, overdue */
    List<Map<String, Object>> getSupplierPaymentSummary(Long branchId);

    /** Ageing analysis for supplier payables */
    List<Map<String, Object>> getSupplierPayablesAgeing(Long branchId);

    /** Payment history per supplier */
    List<Map<String, Object>> getSupplierPaymentHistory(Long supplierId, LocalDate startDate, LocalDate endDate);

    /** Overdue supplier payments */
    List<Map<String, Object>> getOverdueSupplierPayments(Long branchId);

    // ===================== SUPPLIER PERFORMANCE =====================

    /** Supplier reliability: GRNs received on time vs late */
    List<Map<String, Object>> getSupplierDeliveryPerformance(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Supplier return rate (RGRN / total received) */
    List<Map<String, Object>> getSupplierReturnRateReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Most supplied products per supplier */
    List<Map<String, Object>> getSupplierProductMix(Long supplierId, LocalDate startDate, LocalDate endDate);

    /** Full supplier master report */
    List<Map<String, Object>> getSupplierMasterReport(Long branchId);
}