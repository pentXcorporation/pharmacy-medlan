package com.pharmacy.medlan.service.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive Employee Report Service
 * Covers: attendance, payroll, performance, productivity, and HR analytics
 */
public interface EmployeeReportService {

    // ===================== ATTENDANCE REPORTS =====================

    /** Full attendance summary for all employees in a branch over a period */
    List<Map<String, Object>> getAttendanceSummaryReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Per-employee attendance details: total days, present, absent, late, work hours */
    Map<String, Object> getEmployeeAttendanceDetail(Long employeeId, LocalDate startDate, LocalDate endDate);

    /** Attendance rate (%) per employee for a given period */
    List<Map<String, Object>> getAttendanceRateByEmployee(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Employees with most absences */
    List<Map<String, Object>> getTopAbsentees(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Late arrivals report per employee */
    List<Map<String, Object>> getLateArrivalsReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Average daily work hours per employee */
    List<Map<String, Object>> getAverageWorkHoursByEmployee(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Overtime hours per employee */
    List<Map<String, Object>> getOvertimeReport(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== PAYROLL REPORTS =====================

    /** Full payroll summary for a branch in a period */
    Map<String, Object> getPayrollSummaryReport(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Per-employee payroll breakdown: gross, deductions, net */
    List<Map<String, Object>> getEmployeePayrollBreakdown(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Total payroll cost per month trend */
    Map<String, BigDecimal> getMonthlyPayrollTrend(Long branchId, int months);

    /** Payroll cost by employment type (FULL_TIME, PART_TIME, CONTRACT) */
    Map<String, BigDecimal> getPayrollByEmploymentType(Long branchId, LocalDate startDate, LocalDate endDate);

    // ===================== PERFORMANCE & PRODUCTIVITY REPORTS =====================

    /** Sales performance per employee (who sold what, how much) */
    List<Map<String, Object>> getEmployeeSalesPerformance(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Employee productivity: number of transactions handled */
    List<Map<String, Object>> getEmployeeTransactionCount(Long branchId, LocalDate startDate, LocalDate endDate);

    /** Top performing employees by sales amount */
    List<Map<String, Object>> getTopPerformingEmployees(Long branchId, LocalDate startDate, LocalDate endDate, int limit);

    /** Employee performance scorecard (attendance + sales + punctuality) */
    Map<String, Object> getEmployeeScorecard(Long employeeId, LocalDate startDate, LocalDate endDate);

    // ===================== HR ANALYTICS =====================

    /** Headcount summary by role, employment type, status */
    Map<String, Object> getHeadcountSummary(Long branchId);

    /** Employee tenure / length of service distribution */
    List<Map<String, Object>> getEmployeeTenureReport(Long branchId);

    /** Salary distribution across roles */
    Map<String, Object> getSalaryDistributionReport(Long branchId);

    /** Full employee master report (all employees with all key details) */
    List<Map<String, Object>> getEmployeeMasterReport(Long branchId);
}