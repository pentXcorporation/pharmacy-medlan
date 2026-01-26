package com.pharmacy.medlan.service.dashboard;

import com.pharmacy.medlan.dto.response.dashboard.BranchAnalyticsResponse;
import com.pharmacy.medlan.dto.response.dashboard.SuperAdminDashboardResponse;
import com.pharmacy.medlan.dto.response.dashboard.SystemMetricsResponse;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.model.user.UserSession;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.report.ExpiryAlertRepository;
import com.pharmacy.medlan.repository.report.LowStockAlertRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.repository.user.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Super Admin Dashboard
 * Provides real-time metrics and analytics
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuperAdminDashboardService {

    private final BranchRepository branchRepository;
    private final SaleRepository saleRepository;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final ProductRepository productRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final LowStockAlertRepository lowStockAlertRepository;
    private final ExpiryAlertRepository expiryAlertRepository;

    private static final LocalDateTime APPLICATION_START_TIME = LocalDateTime.now();

    /**
     * Get complete Super Admin Dashboard data
     */
    public SuperAdminDashboardResponse getDashboardData() {
        log.info("Fetching Super Admin Dashboard data");

        return SuperAdminDashboardResponse.builder()
                .systemHealth(getSystemHealth())
                .businessMetrics(getBusinessMetrics())
                .topPerformingBranches(getTopPerformingBranches(5))
                .recentActivities(getRecentActivities(10))
                .inventoryOverview(getInventoryOverview())
                .userStatistics(getUserStatistics())
                .financialSummary(getFinancialSummary())
                .build();
    }

    /**
     * Get System Health Metrics
     */
    public SystemMetricsResponse getSystemMetrics() {
        log.info("Fetching system metrics");

        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();

        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed() / (1024 * 1024);
        long maxMemory = memoryBean.getHeapMemoryUsage().getMax() / (1024 * 1024);
        long freeMemory = maxMemory - usedMemory;
        double memoryUsagePercentage = (double) usedMemory / maxMemory * 100;

        int activeUsers = userSessionRepository.countActiveSessions();
        int activeSessions = activeUsers; // Same for now

        return SystemMetricsResponse.builder()
                .status(determineSystemStatus(memoryUsagePercentage, activeUsers))
                .uptime(calculateUptime())
                .responseTime(50L) // This should be calculated from actual metrics
                .activeUsers(activeUsers)
                .activeSessions(activeSessions)
                .dbConnections(activeUsers) // Approximate
                .maxDbConnections(20)
                .errorRate(0.01) // This should be tracked from actual errors
                .lastBackup(LocalDateTime.now().minusHours(2)) // Should come from backup system
                .memory(SystemMetricsResponse.MemoryMetrics.builder()
                        .used(usedMemory)
                        .max(maxMemory)
                        .free(freeMemory)
                        .usagePercentage(memoryUsagePercentage)
                        .build())
                .cpu(SystemMetricsResponse.CpuMetrics.builder()
                        .usage(osBean.getSystemLoadAverage())
                        .cores(Runtime.getRuntime().availableProcessors())
                        .loadAverage(osBean.getSystemLoadAverage())
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Get Branch Analytics
     */
    public BranchAnalyticsResponse getBranchAnalytics() {
        log.info("Fetching branch analytics");

        List<Branch> branches = branchRepository.findAll();
        List<BranchAnalyticsResponse.BranchPerformanceDetail> branchDetails = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minusDays(7).toLocalDate().atStartOfDay();
        LocalDateTime monthStart = now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime yearStart = now.withDayOfYear(1).toLocalDate().atStartOfDay();

        // Previous period for comparison
        LocalDateTime prevDayStart = todayStart.minusDays(1);
        LocalDateTime prevWeekStart = weekStart.minusDays(7);
        LocalDateTime prevMonthStart = monthStart.minusMonths(1);

        for (Branch branch : branches) {
            // Sales metrics
            BigDecimal todaySales = getSalesForPeriod(branch.getId(), todayStart, now);
            BigDecimal weekSales = getSalesForPeriod(branch.getId(), weekStart, now);
            BigDecimal monthSales = getSalesForPeriod(branch.getId(), monthStart, now);
            BigDecimal yearSales = getSalesForPeriod(branch.getId(), yearStart, now);

            // Previous period sales for growth calculation
            BigDecimal prevDaySales = getSalesForPeriod(branch.getId(), prevDayStart, todayStart);
            BigDecimal prevWeekSales = getSalesForPeriod(branch.getId(), prevWeekStart, weekStart);
            BigDecimal prevMonthSales = getSalesForPeriod(branch.getId(), prevMonthStart, monthStart);

            // Order metrics
            Integer todayOrders = getOrdersForPeriod(branch.getId(), todayStart, now);
            Integer weekOrders = getOrdersForPeriod(branch.getId(), weekStart, now);
            Integer monthOrders = getOrdersForPeriod(branch.getId(), monthStart, now);
            Integer yearOrders = getOrdersForPeriod(branch.getId(), yearStart, now);

            // Inventory metrics
            Long totalProducts = branchInventoryRepository.countByBranchId(branch.getId());
            Long lowStockItems = lowStockAlertRepository.countByBranchId(branch.getId());
            Long outOfStockItems = branchInventoryRepository.countOutOfStockByBranchId(branch.getId());

            // User metrics
            Integer totalStaff = userRepository.findByBranchId(branch.getId()).size();
            Integer activeStaff = (int) userRepository.findByBranchId(branch.getId())
                    .stream().filter(User::getIsActive).count();

            branchDetails.add(BranchAnalyticsResponse.BranchPerformanceDetail.builder()
                    .branchId(branch.getId())
                    .branchName(branch.getBranchName())
                    .branchCode(branch.getBranchCode())
                    .isActive(branch.getIsActive())
                    .city(branch.getCity())
                    .state(branch.getState())
                    .todaySales(todaySales)
                    .weekToDateSales(weekSales)
                    .monthToDateSales(monthSales)
                    .yearToDateSales(yearSales)
                    .todayOrders(todayOrders)
                    .weekToDateOrders(weekOrders)
                    .monthToDateOrders(monthOrders)
                    .yearToDateOrders(yearOrders)
                    .dailyGrowth(calculateGrowth(todaySales, prevDaySales))
                    .weeklyGrowth(calculateGrowth(weekSales, prevWeekSales))
                    .monthlyGrowth(calculateGrowth(monthSales, prevMonthSales))
                    .totalProducts(totalProducts)
                    .lowStockItems(lowStockItems)
                    .outOfStockItems(outOfStockItems)
                    .totalStaff(totalStaff)
                    .activeStaff(activeStaff)
                    .build());
        }

        // Calculate rankings
        branchDetails = calculateRankings(branchDetails);

        // Calculate summary
        BigDecimal totalSales = branchDetails.stream()
                .map(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateSales)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalOrders = branchDetails.stream()
                .map(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateOrders)
                .reduce(0, Integer::sum);

        int activeBranches = (int) branchDetails.stream()
                .filter(BranchAnalyticsResponse.BranchPerformanceDetail::getIsActive)
                .count();

        BranchAnalyticsResponse.BranchComparisonSummary summary = BranchAnalyticsResponse.BranchComparisonSummary.builder()
                .totalBranches(branchDetails.size())
                .activeBranches(activeBranches)
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .averageSalesPerBranch(
                        branchDetails.isEmpty() ? BigDecimal.ZERO :
                                totalSales.divide(BigDecimal.valueOf(branchDetails.size()), 2, RoundingMode.HALF_UP)
                )
                .topPerformingBranch(
                        branchDetails.stream()
                                .max(Comparator.comparing(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateSales))
                                .map(BranchAnalyticsResponse.BranchPerformanceDetail::getBranchName)
                                .orElse("N/A")
                )
                .leastPerformingBranch(
                        branchDetails.stream()
                                .filter(BranchAnalyticsResponse.BranchPerformanceDetail::getIsActive)
                                .min(Comparator.comparing(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateSales))
                                .map(BranchAnalyticsResponse.BranchPerformanceDetail::getBranchName)
                                .orElse("N/A")
                )
                .build();

        return BranchAnalyticsResponse.builder()
                .branches(branchDetails)
                .summary(summary)
                .build();
    }

    // ==================== Private Helper Methods ====================

    private SuperAdminDashboardResponse.SystemHealth getSystemHealth() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed() / (1024 * 1024);
        long maxMemory = memoryBean.getHeapMemoryUsage().getMax() / (1024 * 1024);
        double memoryUsagePercentage = (double) usedMemory / maxMemory * 100;

        int activeUsers = userSessionRepository.countActiveSessions();

        return SuperAdminDashboardResponse.SystemHealth.builder()
                .status(determineSystemStatus(memoryUsagePercentage, activeUsers))
                .uptime(calculateUptime())
                .responseTime(50L)
                .activeUsers(activeUsers)
                .activeSessions(activeUsers)
                .dbConnections(activeUsers)
                .maxDbConnections(20)
                .errorRate(0.01)
                .lastBackup(LocalDateTime.now().minusHours(2))
                .memoryUsage(usedMemory)
                .maxMemory(maxMemory)
                .cpuUsage(ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage())
                .build();
    }

    private SuperAdminDashboardResponse.BusinessMetrics getBusinessMetrics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime yesterdayStart = todayStart.minusDays(1);
        LocalDateTime monthStart = now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime yearStart = now.withDayOfYear(1).toLocalDate().atStartOfDay();

        BigDecimal todaySales = getTotalSalesForPeriod(todayStart, now);
        BigDecimal yesterdaySales = getTotalSalesForPeriod(yesterdayStart, todayStart);
        BigDecimal monthSales = getTotalSalesForPeriod(monthStart, now);
        BigDecimal yearSales = getTotalSalesForPeriod(yearStart, now);

        Integer todayOrders = getTotalOrdersForPeriod(todayStart, now);
        Long draftOrders = saleRepository.countByStatus(SaleStatus.DRAFT);
        Long completedOrders = saleRepository.countByStatus(SaleStatus.COMPLETED);

        BigDecimal avgOrderValue = todayOrders > 0 ?
                todaySales.divide(BigDecimal.valueOf(todayOrders), 2, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;

        Double growthRate = calculateGrowth(todaySales, yesterdaySales);

        return SuperAdminDashboardResponse.BusinessMetrics.builder()
                .todaySales(todaySales)
                .yesterdaySales(yesterdaySales)
                .monthToDateSales(monthSales)
                .yearToDateSales(yearSales)
                .todayOrders(todayOrders)
                .pendingOrders(draftOrders.intValue())
                .completedOrders(completedOrders.intValue())
                .averageOrderValue(avgOrderValue)
                .salesGrowthRate(growthRate)
                .build();
    }

    private List<SuperAdminDashboardResponse.BranchPerformance> getTopPerformingBranches(int limit) {
        List<Branch> branches = branchRepository.findAllActive();
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();

        List<SuperAdminDashboardResponse.BranchPerformance> performances = branches.stream()
                .map(branch -> {
                    BigDecimal todaySales = getSalesForPeriod(branch.getId(), todayStart, now);
                    BigDecimal monthSales = getSalesForPeriod(branch.getId(), monthStart, now);
                    Integer todayOrders = getOrdersForPeriod(branch.getId(), todayStart, now);
                    Integer monthOrders = getOrdersForPeriod(branch.getId(), monthStart, now);

                    // Calculate growth compared to previous month
                    LocalDateTime prevMonthStart = monthStart.minusMonths(1);
                    BigDecimal prevMonthSales = getSalesForPeriod(branch.getId(), prevMonthStart, monthStart);
                    Double growthRate = calculateGrowth(monthSales, prevMonthSales);

                    return SuperAdminDashboardResponse.BranchPerformance.builder()
                            .branchId(branch.getId())
                            .branchName(branch.getBranchName())
                            .branchCode(branch.getBranchCode())
                            .todaySales(todaySales)
                            .monthToDateSales(monthSales)
                            .todayOrders(todayOrders)
                            .monthToDateOrders(monthOrders)
                            .isActive(branch.getIsActive())
                            .growthRate(growthRate)
                            .build();
                })
                .sorted(Comparator.comparing(SuperAdminDashboardResponse.BranchPerformance::getMonthToDateSales).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        // Add rankings
        for (int i = 0; i < performances.size(); i++) {
            performances.get(i).setRank(i + 1);
        }

        return performances;
    }

    private List<SuperAdminDashboardResponse.RecentActivity> getRecentActivities(int limit) {
        List<SuperAdminDashboardResponse.RecentActivity> activities = new ArrayList<>();

        // Get recent sales
        List<Sale> recentSales = saleRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Sale::getSaleDate).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        for (Sale sale : recentSales) {
            activities.add(SuperAdminDashboardResponse.RecentActivity.builder()
                    .activityType("SALE")
                    .description(String.format("Sale %s - %s", sale.getSaleNumber(),
                            sale.getTotalAmount().toString()))
                    .branchName(sale.getBranch() != null ? sale.getBranch().getBranchName() : "N/A")
                    .userName(sale.getSoldBy() != null ? sale.getSoldBy().getFullName() : "N/A")
                    .timestamp(sale.getSaleDate())
                    .severity("INFO")
                    .build());
        }

        return activities.stream()
                .sorted(Comparator.comparing(SuperAdminDashboardResponse.RecentActivity::getTimestamp).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private SuperAdminDashboardResponse.InventoryOverview getInventoryOverview() {
        Long totalProducts = productRepository.count();
        Long lowStockItems = lowStockAlertRepository.countCriticalAlerts();
        Long outOfStockItems = branchInventoryRepository.countAllOutOfStock();

        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        Long expiringItems = expiryAlertRepository.countExpiringBefore(thirtyDaysFromNow);
        Long expiredItems = expiryAlertRepository.countExpired();

        BigDecimal totalValue = branchInventoryRepository.calculateTotalInventoryValue();
        Integer criticalAlerts = lowStockItems.intValue() + expiredItems.intValue();

        return SuperAdminDashboardResponse.InventoryOverview.builder()
                .totalProducts(totalProducts)
                .lowStockItems(lowStockItems)
                .outOfStockItems(outOfStockItems)
                .expiringItems(expiringItems)
                .expiredItems(expiredItems)
                .totalInventoryValue(totalValue)
                .criticalAlerts(criticalAlerts)
                .build();
    }

    private SuperAdminDashboardResponse.UserStatistics getUserStatistics() {
        List<User> allUsers = userRepository.findAll();
        Integer totalUsers = allUsers.size();
        Integer activeUsers = (int) allUsers.stream().filter(User::getIsActive).count();
        Integer loggedInUsers = userSessionRepository.countActiveSessions();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Integer recentlyAdded = (int) allUsers.stream()
                .filter(user -> user.getCreatedAt() != null && user.getCreatedAt().isAfter(sevenDaysAgo))
                .count();

        return SuperAdminDashboardResponse.UserStatistics.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .loggedInUsers(loggedInUsers)
                .adminUsers((int) allUsers.stream().filter(u -> u.getRole().name().contains("ADMIN")).count())
                .managerUsers((int) allUsers.stream().filter(u -> u.getRole().name().contains("MANAGER")).count())
                .cashierUsers((int) allUsers.stream().filter(u -> u.getRole().name().contains("CASHIER")).count())
                .recentlyAddedUsers(recentlyAdded)
                .build();
    }

    private SuperAdminDashboardResponse.FinancialSummary getFinancialSummary() {
        LocalDateTime yearStart = LocalDateTime.now().withDayOfYear(1).toLocalDate().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        BigDecimal totalRevenue = getTotalSalesForPeriod(yearStart, now);
        BigDecimal totalExpenses = BigDecimal.ZERO; // Should be calculated from expense records
        BigDecimal netProfit = totalRevenue.subtract(totalExpenses);
        BigDecimal pendingPayments = BigDecimal.ZERO; // Should be calculated from pending invoices
        BigDecimal receivables = BigDecimal.ZERO; // Should be calculated from customer payments
        BigDecimal payables = BigDecimal.ZERO; // Should be calculated from supplier payments

        Double profitMargin = totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                netProfit.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue() : 0.0;

        return SuperAdminDashboardResponse.FinancialSummary.builder()
                .totalRevenue(totalRevenue)
                .totalExpenses(totalExpenses)
                .netProfit(netProfit)
                .pendingPayments(pendingPayments)
                .receivables(receivables)
                .payables(payables)
                .profitMargin(profitMargin)
                .build();
    }

    // ==================== Utility Methods ====================

    private BigDecimal getSalesForPeriod(Long branchId, LocalDateTime start, LocalDateTime end) {
        BigDecimal sales = saleRepository.getTotalSalesByBranchAndDate(branchId, start, end);
        return sales != null ? sales : BigDecimal.ZERO;
    }

    private BigDecimal getTotalSalesForPeriod(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findBySaleDateBetween(start, end)
                .stream()
                .filter(sale -> sale.getStatus() == SaleStatus.COMPLETED)
                .collect(Collectors.toList());

        return sales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Integer getOrdersForPeriod(Long branchId, LocalDateTime start, LocalDateTime end) {
        Long count = saleRepository.countSalesByBranchAndDate(branchId, start, end);
        return count != null ? count.intValue() : 0;
    }

    private Integer getTotalOrdersForPeriod(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findBySaleDateBetween(start, end).size();
    }

    private Double calculateGrowth(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private String determineSystemStatus(double memoryUsage, int activeUsers) {
        if (memoryUsage > 90 || activeUsers > 100) {
            return "CRITICAL";
        } else if (memoryUsage > 75 || activeUsers > 50) {
            return "WARNING";
        }
        return "HEALTHY";
    }

    private Double calculateUptime() {
        Duration uptime = Duration.between(APPLICATION_START_TIME, LocalDateTime.now());
        long totalSeconds = uptime.getSeconds();
        double uptimeHours = totalSeconds / 3600.0;
        // Assuming we want to show uptime as percentage of 24 hours
        return Math.min(99.99, (uptimeHours / 24.0) * 100);
    }

    private List<BranchAnalyticsResponse.BranchPerformanceDetail> calculateRankings(
            List<BranchAnalyticsResponse.BranchPerformanceDetail> branches) {

        // Sort by sales and assign sales rank
        List<BranchAnalyticsResponse.BranchPerformanceDetail> sortedBySales = branches.stream()
                .sorted(Comparator.comparing(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateSales).reversed())
                .collect(Collectors.toList());

        for (int i = 0; i < sortedBySales.size(); i++) {
            sortedBySales.get(i).setSalesRank(i + 1);
        }

        // Sort by orders and assign orders rank
        List<BranchAnalyticsResponse.BranchPerformanceDetail> sortedByOrders = branches.stream()
                .sorted(Comparator.comparing(BranchAnalyticsResponse.BranchPerformanceDetail::getMonthToDateOrders).reversed())
                .collect(Collectors.toList());

        for (int i = 0; i < sortedByOrders.size(); i++) {
            sortedByOrders.get(i).setOrdersRank(i + 1);
        }

        return branches;
    }
}
