package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.enums.AttendanceStatus;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.payroll.Attendance;
import com.pharmacy.medlan.model.payroll.Employee;
import com.pharmacy.medlan.model.payroll.EmployeePayment;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.repository.payroll.AttendanceRepository;
import com.pharmacy.medlan.repository.payroll.EmployeePaymentRepository;
import com.pharmacy.medlan.repository.payroll.EmployeeRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeReportServiceImpl implements EmployeeReportService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeePaymentRepository employeePaymentRepository;
    private final SaleRepository saleRepository;

    // ===================== ATTENDANCE REPORTS =====================

    @Override
    public List<Map<String, Object>> getAttendanceSummaryReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating attendance summary report for branch {} from {} to {}", branchId, startDate, endDate);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        return employees.stream().map(emp -> {
            List<Attendance> records = attendanceRepository.findByEmployeeAndDateRange(emp.getId(), startDate, endDate);

            long present = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
            long absent  = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
            long late    = records.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
            long leave   = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ON_LEAVE).count();
            double totalHours = records.stream()
                    .filter(a -> a.getWorkHours() != null)
                    .mapToDouble(Attendance::getWorkHours)
                    .sum();
            double avgHours = (present + late) > 0
                    ? totalHours / (present + late)
                    : 0.0;

            double attendanceRate = totalDays > 0
                    ? (double)(present + late) / totalDays * 100
                    : 0.0;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("employeeId", emp.getId());
            row.put("employeeName", emp.getFirstName() + " " + emp.getLastName());
            row.put("employeeCode", emp.getEmployeeCode());
            row.put("role", emp.getRole() != null ? emp.getRole().name() : "N/A");
            row.put("designation", emp.getDesignation());
            row.put("totalWorkingDays", totalDays);
            row.put("presentDays", present);
            row.put("absentDays", absent);
            row.put("lateDays", late);
            row.put("leaveDays", leave);
            row.put("totalWorkHours", Math.round(totalHours * 100.0) / 100.0);
            row.put("averageDailyHours", Math.round(avgHours * 100.0) / 100.0);
            row.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);
            return row;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getEmployeeAttendanceDetail(Long employeeId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating attendance detail for employee {}", employeeId);
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        List<Attendance> records = attendanceRepository.findByEmployeeAndDateRange(employeeId, startDate, endDate);
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        long present = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absent  = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long late    = records.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
        long leave   = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ON_LEAVE).count();
        double totalHours = records.stream()
                .filter(a -> a.getWorkHours() != null)
                .mapToDouble(Attendance::getWorkHours).sum();

        // Daily breakdown
        List<Map<String, Object>> daily = records.stream().map(a -> {
            Map<String, Object> d = new LinkedHashMap<>();
            d.put("date", a.getDate());
            d.put("status", a.getStatus());
            d.put("checkIn", a.getCheckIn());
            d.put("checkOut", a.getCheckOut());
            d.put("workHours", a.getWorkHours());
            d.put("notes", a.getNotes());
            d.put("approved", a.getIsApproved());
            return d;
        }).collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("employeeId", emp.getId());
        result.put("employeeName", emp.getFirstName() + " " + emp.getLastName());
        result.put("employeeCode", emp.getEmployeeCode());
        result.put("designation", emp.getDesignation());
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("totalWorkingDays", totalDays);
        result.put("presentDays", present);
        result.put("absentDays", absent);
        result.put("lateDays", late);
        result.put("leaveDays", leave);
        result.put("totalWorkHours", Math.round(totalHours * 100.0) / 100.0);
        result.put("attendanceRate", totalDays > 0
                ? Math.round((double)(present + late) / totalDays * 10000.0) / 100.0 : 0.0);
        result.put("dailyRecords", daily);
        return result;
    }

    @Override
    public List<Map<String, Object>> getAttendanceRateByEmployee(Long branchId, LocalDate startDate, LocalDate endDate) {
        return getAttendanceSummaryReport(branchId, startDate, endDate).stream()
                .sorted(Comparator.comparingDouble(m -> -(double) m.get("attendanceRate")))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopAbsentees(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        return getAttendanceSummaryReport(branchId, startDate, endDate).stream()
                .sorted(Comparator.comparingLong(m -> -(long) m.get("absentDays")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getLateArrivalsReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating late arrivals report for branch {}", branchId);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);

        return employees.stream().map(emp -> {
                    List<Attendance> lateRecords = attendanceRepository
                            .findByEmployeeAndDateRange(emp.getId(), startDate, endDate)
                            .stream()
                            .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                            .collect(Collectors.toList());

                    List<Map<String, Object>> lateDates = lateRecords.stream().map(a -> {
                        Map<String, Object> d = new LinkedHashMap<>();
                        d.put("date", a.getDate());
                        d.put("checkIn", a.getCheckIn());
                        d.put("notes", a.getNotes());
                        return d;
                    }).collect(Collectors.toList());

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("employeeId", emp.getId());
                    row.put("employeeName", emp.getFirstName() + " " + emp.getLastName());
                    row.put("employeeCode", emp.getEmployeeCode());
                    row.put("lateCount", lateRecords.size());
                    row.put("lateDates", lateDates);
                    return row;
                })
                .filter(m -> (int) m.get("lateCount") > 0)
                .sorted(Comparator.comparingInt(m -> -(int) m.get("lateCount")))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getAverageWorkHoursByEmployee(Long branchId, LocalDate startDate, LocalDate endDate) {
        return getAttendanceSummaryReport(branchId, startDate, endDate).stream()
                .map(m -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("employeeId", m.get("employeeId"));
                    row.put("employeeName", m.get("employeeName"));
                    row.put("employeeCode", m.get("employeeCode"));
                    row.put("averageDailyHours", m.get("averageDailyHours"));
                    row.put("totalWorkHours", m.get("totalWorkHours"));
                    return row;
                })
                .sorted(Comparator.comparingDouble(m -> -(double) m.get("totalWorkHours")))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getOvertimeReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating overtime report for branch {}", branchId);
        double standardDailyHours = 8.0;
        List<Employee> employees = employeeRepository.findByBranchId(branchId);

        return employees.stream().map(emp -> {
                    List<Attendance> records = attendanceRepository.findByEmployeeAndDateRange(emp.getId(), startDate, endDate);
                    double overtimeHours = records.stream()
                            .filter(a -> a.getWorkHours() != null && a.getWorkHours() > standardDailyHours)
                            .mapToDouble(a -> a.getWorkHours() - standardDailyHours)
                            .sum();

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("employeeId", emp.getId());
                    row.put("employeeName", emp.getFirstName() + " " + emp.getLastName());
                    row.put("employeeCode", emp.getEmployeeCode());
                    row.put("overtimeHours", Math.round(overtimeHours * 100.0) / 100.0);
                    return row;
                })
                .filter(m -> (double) m.get("overtimeHours") > 0)
                .sorted(Comparator.comparingDouble(m -> -(double) m.get("overtimeHours")))
                .collect(Collectors.toList());
    }

    // ===================== PAYROLL REPORTS =====================

    @Override
    public Map<String, Object> getPayrollSummaryReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating payroll summary for branch {}", branchId);
        List<EmployeePayment> payments = employeePaymentRepository
                .findByBranchIdAndDateRange(branchId, startDate, endDate);

        BigDecimal totalGross    = payments.stream().map(p -> p.getBasicSalary() != null ? p.getBasicSalary() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAllowances = payments.stream().map(p -> p.getAllowances() != null ? p.getAllowances() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDeductions = payments.stream().map(p -> p.getDeductions() != null ? p.getDeductions() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalNet      = payments.stream().map(p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("branchId", branchId);
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);
        summary.put("totalEmployeesPaid", payments.size());
        summary.put("totalGrossSalary", totalGross);
        summary.put("totalAllowances", totalAllowances);
        summary.put("totalDeductions", totalDeductions);
        summary.put("totalNetSalary", totalNet);
        return summary;
    }

    @Override
    public List<Map<String, Object>> getEmployeePayrollBreakdown(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating payroll breakdown for branch {}", branchId);
        List<EmployeePayment> payments = employeePaymentRepository
                .findByBranchIdAndDateRange(branchId, startDate, endDate);

        return payments.stream().map(p -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("employeeId", p.getEmployee() != null ? p.getEmployee().getId() : null);
            row.put("employeeName", p.getEmployee() != null
                    ? p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName() : "N/A");
            row.put("employeeCode", p.getEmployee() != null ? p.getEmployee().getEmployeeCode() : "N/A");
            row.put("designation", p.getEmployee() != null ? p.getEmployee().getDesignation() : "N/A");
            row.put("paymentDate", p.getPaymentDate());
            row.put("payPeriodStart", p.getPayPeriodStart());
            row.put("payPeriodEnd", p.getPayPeriodEnd());
            row.put("basicSalary", p.getBasicSalary());
            row.put("allowances", p.getAllowances());
            row.put("deductions", p.getDeductions());
            row.put("netSalary", p.getNetSalary());
            row.put("paymentMethod", p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "N/A");
            row.put("status", p.getStatus() != null ? p.getStatus() : "N/A");
            return row;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, BigDecimal> getMonthlyPayrollTrend(Long branchId, int months) {
        log.info("Generating monthly payroll trend for last {} months for branch {}", months, branchId);
        Map<String, BigDecimal> trend = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            String monthKey = monthStart.getYear() + "-" + String.format("%02d", monthStart.getMonthValue());

            List<EmployeePayment> payments = employeePaymentRepository
                    .findByBranchIdAndDateRange(branchId, monthStart, monthEnd);
            BigDecimal total = payments.stream()
                    .map(p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            trend.put(monthKey, total);
        }
        return trend;
    }

    @Override
    public Map<String, BigDecimal> getPayrollByEmploymentType(Long branchId, LocalDate startDate, LocalDate endDate) {
        List<EmployeePayment> payments = employeePaymentRepository
                .findByBranchIdAndDateRange(branchId, startDate, endDate);

        return payments.stream()
                .filter(p -> p.getEmployee() != null && p.getEmployee().getEmploymentType() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getEmployee().getEmploymentType().name(),
                        Collectors.reducing(BigDecimal.ZERO,
                                p -> p.getNetSalary() != null ? p.getNetSalary() : BigDecimal.ZERO,
                                BigDecimal::add)
                ));
    }

    // ===================== PERFORMANCE & PRODUCTIVITY REPORTS =====================

    @Override
    public List<Map<String, Object>> getEmployeeSalesPerformance(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating employee sales performance for branch {}", branchId);
        List<Sale> sales = saleRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));

        Map<Long, Map<String, Object>> performanceMap = new LinkedHashMap<>();

        for (Sale sale : sales) {
            if (sale.getStatus() != SaleStatus.COMPLETED) continue;
            if (sale.getCashier() == null) continue;

            Long empId = sale.getCashier().getId();
            performanceMap.computeIfAbsent(empId, id -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("employeeId", id);
                m.put("employeeName", sale.getCashier().getFirstName() + " " + sale.getCashier().getLastName());
                m.put("employeeCode", sale.getCashier().getEmployeeCode());
                m.put("role", sale.getCashier().getRole() != null ? sale.getCashier().getRole().name() : "N/A");
                m.put("totalSales", BigDecimal.ZERO);
                m.put("transactionCount", 0);
                m.put("totalDiscount", BigDecimal.ZERO);
                m.put("averageTransactionValue", BigDecimal.ZERO);
                return m;
            });

            Map<String, Object> empData = performanceMap.get(empId);
            BigDecimal currentTotal = (BigDecimal) empData.get("totalSales");
            empData.put("totalSales", currentTotal.add(sale.getTotalAmount()));
            empData.put("transactionCount", (int) empData.get("transactionCount") + 1);
            BigDecimal disc = sale.getDiscountAmount() != null ? sale.getDiscountAmount() : BigDecimal.ZERO;
            empData.put("totalDiscount", ((BigDecimal) empData.get("totalDiscount")).add(disc));
        }

        // Calculate averages
        performanceMap.values().forEach(m -> {
            int count = (int) m.get("transactionCount");
            BigDecimal total = (BigDecimal) m.get("totalSales");
            m.put("averageTransactionValue", count > 0
                    ? total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO);
        });

        return performanceMap.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalSales")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getEmployeeTransactionCount(Long branchId, LocalDate startDate, LocalDate endDate) {
        return getEmployeeSalesPerformance(branchId, startDate, endDate).stream()
                .map(m -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("employeeId", m.get("employeeId"));
                    row.put("employeeName", m.get("employeeName"));
                    row.put("employeeCode", m.get("employeeCode"));
                    row.put("transactionCount", m.get("transactionCount"));
                    row.put("totalSales", m.get("totalSales"));
                    return row;
                })
                .sorted(Comparator.comparingInt(m -> -(int) m.get("transactionCount")))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopPerformingEmployees(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        return getEmployeeSalesPerformance(branchId, startDate, endDate).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getEmployeeScorecard(Long employeeId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating scorecard for employee {}", employeeId);
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        // Attendance score
        Map<String, Object> attendanceDetail = getEmployeeAttendanceDetail(employeeId, startDate, endDate);
        double attendanceRate = (double) attendanceDetail.get("attendanceRate");

        // Sales performance
        List<Sale> sales = saleRepository.findByBranchAndDateRange(
                emp.getBranch() != null ? emp.getBranch().getId() : null,
                startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        BigDecimal empSales = sales.stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED
                        && s.getCashier() != null && s.getCashier().getId().equals(employeeId))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long empTxCount = sales.stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED
                        && s.getCashier() != null && s.getCashier().getId().equals(employeeId))
                .count();

        // Punctuality score (% of days on time = present / (present + late))
        long present = (long) attendanceDetail.get("presentDays");
        long late    = (long) attendanceDetail.get("lateDays");
        double punctualityRate = (present + late) > 0 ? (double) present / (present + late) * 100 : 100.0;

        // Composite score (weighted): attendance 40%, punctuality 30%, transactions 30%
        // Normalize transactions against a target of 10/day
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double txTarget = totalDays * 10;
        double txScore = Math.min(100.0, (empTxCount / Math.max(txTarget, 1)) * 100);
        double compositeScore = (attendanceRate * 0.4) + (punctualityRate * 0.3) + (txScore * 0.3);

        Map<String, Object> scorecard = new LinkedHashMap<>();
        scorecard.put("employeeId", emp.getId());
        scorecard.put("employeeName", emp.getFirstName() + " " + emp.getLastName());
        scorecard.put("employeeCode", emp.getEmployeeCode());
        scorecard.put("designation", emp.getDesignation());
        scorecard.put("evaluationPeriod", Map.of("startDate", startDate, "endDate", endDate));
        scorecard.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);
        scorecard.put("punctualityRate", Math.round(punctualityRate * 100.0) / 100.0);
        scorecard.put("totalSales", empSales);
        scorecard.put("transactionCount", empTxCount);
        scorecard.put("compositeScore", Math.round(compositeScore * 100.0) / 100.0);
        scorecard.put("grade", compositeScore >= 90 ? "A" : compositeScore >= 75 ? "B" :
                compositeScore >= 60 ? "C" : compositeScore >= 45 ? "D" : "F");
        return scorecard;
    }

    // ===================== HR ANALYTICS =====================

    @Override
    public Map<String, Object> getHeadcountSummary(Long branchId) {
        log.info("Generating headcount summary for branch {}", branchId);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);

        Map<String, Long> byRole = employees.stream()
                .filter(e -> e.getRole() != null)
                .collect(Collectors.groupingBy(e -> e.getRole().name(), Collectors.counting()));

        Map<String, Long> byEmploymentType = employees.stream()
                .filter(e -> e.getEmploymentType() != null)
                .collect(Collectors.groupingBy(e -> e.getEmploymentType().name(), Collectors.counting()));

        long activeCount   = employees.stream().filter(e -> Boolean.TRUE.equals(e.getIsActive())).count();
        long inactiveCount = employees.stream().filter(e -> !Boolean.TRUE.equals(e.getIsActive())).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalEmployees", employees.size());
        summary.put("activeEmployees", activeCount);
        summary.put("inactiveEmployees", inactiveCount);
        summary.put("byRole", byRole);
        summary.put("byEmploymentType", byEmploymentType);
        return summary;
    }

    @Override
    public List<Map<String, Object>> getEmployeeTenureReport(Long branchId) {
        log.info("Generating tenure report for branch {}", branchId);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);
        LocalDate today = LocalDate.now();

        return employees.stream()
                .filter(e -> e.getJoiningDate() != null)
                .map(e -> {
                    long months = ChronoUnit.MONTHS.between(e.getJoiningDate(), today);
                    String tenureBucket;
                    if (months < 6)        tenureBucket = "0-6 months";
                    else if (months < 12)  tenureBucket = "6-12 months";
                    else if (months < 24)  tenureBucket = "1-2 years";
                    else if (months < 60)  tenureBucket = "2-5 years";
                    else                   tenureBucket = "5+ years";

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("employeeId", e.getId());
                    row.put("employeeName", e.getFirstName() + " " + e.getLastName());
                    row.put("joiningDate", e.getJoiningDate());
                    row.put("tenureMonths", months);
                    row.put("tenureYears", Math.round(months / 12.0 * 10.0) / 10.0);
                    row.put("tenureBucket", tenureBucket);
                    return row;
                })
                .sorted(Comparator.comparingLong(m -> -(long) m.get("tenureMonths")))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getSalaryDistributionReport(Long branchId) {
        log.info("Generating salary distribution report for branch {}", branchId);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);

        Map<String, List<BigDecimal>> salariesByRole = new LinkedHashMap<>();
        for (Employee e : employees) {
            if (e.getBasicSalary() == null) continue;
            String role = e.getRole() != null ? e.getRole().name() : "UNASSIGNED";
            salariesByRole.computeIfAbsent(role, r -> new ArrayList<>()).add(e.getBasicSalary());
        }

        Map<String, Object> distribution = new LinkedHashMap<>();
        salariesByRole.forEach((role, salaries) -> {
            BigDecimal avg = salaries.stream().reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(salaries.size()), 2, RoundingMode.HALF_UP);
            BigDecimal min = salaries.stream().min(Comparator.naturalOrder()).orElse(BigDecimal.ZERO);
            BigDecimal max = salaries.stream().max(Comparator.naturalOrder()).orElse(BigDecimal.ZERO);
            distribution.put(role, Map.of("count", salaries.size(), "min", min, "max", max, "average", avg));
        });

        BigDecimal totalPayroll = employees.stream()
                .filter(e -> e.getBasicSalary() != null)
                .map(Employee::getBasicSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalMonthlyPayroll", totalPayroll);
        result.put("totalEmployeesWithSalary",
                employees.stream().filter(e -> e.getBasicSalary() != null).count());
        result.put("byRole", distribution);
        return result;
    }

    @Override
    public List<Map<String, Object>> getEmployeeMasterReport(Long branchId) {
        log.info("Generating employee master report for branch {}", branchId);
        List<Employee> employees = employeeRepository.findByBranchId(branchId);
        LocalDate today = LocalDate.now();

        return employees.stream().map(e -> {
            long tenureMonths = e.getJoiningDate() != null
                    ? ChronoUnit.MONTHS.between(e.getJoiningDate(), today) : 0;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("employeeId", e.getId());
            row.put("employeeCode", e.getEmployeeCode());
            row.put("fullName", e.getFirstName() + " " + e.getLastName());
            row.put("email", e.getEmail());
            row.put("phone", e.getPhone());
            row.put("designation", e.getDesignation());
            row.put("role", e.getRole() != null ? e.getRole().name() : "N/A");
            row.put("employmentType", e.getEmploymentType() != null ? e.getEmploymentType().name() : "N/A");
            row.put("joiningDate", e.getJoiningDate());
            row.put("tenureMonths", tenureMonths);
            row.put("basicSalary", e.getBasicSalary());
            row.put("isActive", e.getIsActive());
            row.put("branch", e.getBranch() != null ? e.getBranch().getBranchName() : "N/A");
            return row;
        }).collect(Collectors.toList());
    }
}