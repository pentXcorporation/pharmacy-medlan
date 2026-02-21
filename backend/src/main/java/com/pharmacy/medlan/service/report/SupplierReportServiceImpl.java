package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.mapper.SaleMapper;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.model.pos.SaleItem;
import com.pharmacy.medlan.model.pos.SaleReturn;
import com.pharmacy.medlan.model.pos.SaleReturnItem;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.pos.SaleReturnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalesReportServiceImpl implements SalesReportService {

    private final SaleRepository saleRepository;
    private final SaleReturnRepository saleReturnRepository;
    private final SaleMapper saleMapper;

    // ===================== HELPERS =====================

    private List<Sale> fetchCompleted(Long branchId, LocalDate startDate, LocalDate endDate) {
        return saleRepository.findByBranchAndDateRange(
                        branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX))
                .stream().filter(s -> s.getStatus() == SaleStatus.COMPLETED).collect(Collectors.toList());
    }

    // ===================== CORE SALES =====================

    @Override
    public BigDecimal getTotalSales(Long branchId, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = saleRepository.getTotalSalesByBranchAndDate(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public Long getSalesCount(Long branchId, LocalDate startDate, LocalDate endDate) {
        return (long) saleRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX)).size();
    }

    @Override
    public List<SaleResponse> getSalesReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = saleRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        return saleMapper.toResponseList(sales);
    }

    @Override
    public Map<String, BigDecimal> getDailySalesSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> dailySales = new LinkedHashMap<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            BigDecimal dailyTotal = saleRepository.getTotalSalesByBranchAndDate(
                    branchId, current.atStartOfDay(), current.atTime(LocalTime.MAX));
            dailySales.put(current.toString(), dailyTotal != null ? dailyTotal : BigDecimal.ZERO);
            current = current.plusDays(1);
        }
        return dailySales;
    }

    @Override
    public List<Map<String, Object>> getTopSellingProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("Top selling products for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);
        Map<Long, Map<String, Object>> productMap = new LinkedHashMap<>();

        for (Sale sale : sales) {
            if (sale.getSaleItems() == null) continue;
            for (SaleItem item : sale.getSaleItems()) {
                if (item.getProduct() == null) continue;
                Long pid = item.getProduct().getId();
                productMap.computeIfAbsent(pid, id -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("productId", id);
                    m.put("productName", item.getProduct().getProductName());
                    m.put("productCode", item.getProduct().getProductCode());
                    m.put("category", item.getProduct().getCategory() != null
                            ? item.getProduct().getCategory().getCategoryName() : "N/A");
                    m.put("totalQuantitySold", 0);
                    m.put("totalRevenue", BigDecimal.ZERO);
                    return m;
                });
                Map<String, Object> p = productMap.get(pid);
                p.put("totalQuantitySold", (int) p.get("totalQuantitySold") + item.getQuantity());
                p.put("totalRevenue", ((BigDecimal) p.get("totalRevenue")).add(item.getTotalAmount()));
            }
        }
        return productMap.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalRevenue")).negate()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getSalesByPaymentMethod(Long branchId, LocalDate startDate, LocalDate endDate) {
        List<Sale> sales = saleRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));

        Map<String, List<Sale>> byMethod = sales.stream()
                .filter(s -> s.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(s -> s.getPaymentMethod().name()));

        return byMethod.entrySet().stream().map(e -> {
                    BigDecimal total = e.getValue().stream()
                            .map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("paymentMethod", e.getKey());
                    m.put("total", total);
                    m.put("count", e.getValue().size());
                    m.put("averageAmount", e.getValue().size() > 0
                            ? total.divide(BigDecimal.valueOf(e.getValue().size()), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO);
                    return m;
                })
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("total")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getSalesComparison(Long branchId, LocalDate startDate1, LocalDate endDate1,
                                                  LocalDate startDate2, LocalDate endDate2) {
        BigDecimal period1Total = getTotalSales(branchId, startDate1, endDate1);
        BigDecimal period2Total = getTotalSales(branchId, startDate2, endDate2);
        BigDecimal difference = period2Total.subtract(period1Total);
        BigDecimal percentChange = period1Total.compareTo(BigDecimal.ZERO) != 0
                ? difference.multiply(BigDecimal.valueOf(100)).divide(period1Total, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> comparison = new LinkedHashMap<>();
        comparison.put("period1", Map.of("start", startDate1, "end", endDate1, "total", period1Total,
                "count", getSalesCount(branchId, startDate1, endDate1)));
        comparison.put("period2", Map.of("start", startDate2, "end", endDate2, "total", period2Total,
                "count", getSalesCount(branchId, startDate2, endDate2)));
        comparison.put("difference", difference);
        comparison.put("percentChange", percentChange);
        comparison.put("trend", percentChange.compareTo(BigDecimal.ZERO) >= 0 ? "GROWTH" : "DECLINE");
        return comparison;
    }

    // ===================== ENHANCED SALES ANALYTICS =====================

    @Override
    public Map<String, BigDecimal> getHourlySalesDistribution(Long branchId, LocalDate date) {
        log.info("Hourly sales distribution for branch {} on {}", branchId, date);
        List<Sale> sales = fetchCompleted(branchId, date, date);
        Map<String, BigDecimal> hourly = new LinkedHashMap<>();
        // Initialize all 24 hours
        for (int h = 0; h < 24; h++) {
            hourly.put(String.format("%02d:00", h), BigDecimal.ZERO);
        }
        for (Sale sale : sales) {
            if (sale.getSaleDate() == null) continue;
            int hour = sale.getSaleDate().getHour();
            String key = String.format("%02d:00", hour);
            hourly.merge(key, sale.getTotalAmount(), BigDecimal::add);
        }
        return hourly;
    }

    @Override
    public Map<String, BigDecimal> getSalesByDayOfWeek(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Sales by day of week for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);
        Map<String, BigDecimal> byDay = new LinkedHashMap<>();
        // Initialize in order
        for (DayOfWeek dow : DayOfWeek.values()) {
            byDay.put(dow.name(), BigDecimal.ZERO);
        }
        for (Sale sale : sales) {
            if (sale.getSaleDate() == null) continue;
            String day = sale.getSaleDate().getDayOfWeek().name();
            byDay.merge(day, sale.getTotalAmount(), BigDecimal::add);
        }
        return byDay;
    }

    @Override
    public Map<String, BigDecimal> getWeeklySalesSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Weekly sales summary for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);
        Map<String, BigDecimal> weekly = new TreeMap<>();
        WeekFields weekFields = WeekFields.ISO;
        for (Sale sale : sales) {
            if (sale.getSaleDate() == null) continue;
            LocalDate d = sale.getSaleDate().toLocalDate();
            int week = d.get(weekFields.weekOfWeekBasedYear());
            int year = d.get(weekFields.weekBasedYear());
            String key = year + "-W" + String.format("%02d", week);
            weekly.merge(key, sale.getTotalAmount(), BigDecimal::add);
        }
        return weekly;
    }

    @Override
    public Map<String, BigDecimal> getMonthlySalesSummary(Long branchId, int months) {
        log.info("Monthly sales summary for last {} months, branch {}", months, branchId);
        Map<String, BigDecimal> monthly = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            String key = monthStart.getYear() + "-" + String.format("%02d", monthStart.getMonthValue());
            monthly.put(key, getTotalSales(branchId, monthStart, monthEnd));
        }
        return monthly;
    }

    @Override
    public Map<String, Object> getSalesTrendAnalysis(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Sales trend analysis for branch {}", branchId);
        Map<String, BigDecimal> daily = getDailySalesSummary(branchId, startDate, endDate);
        List<BigDecimal> values = new ArrayList<>(daily.values());

        BigDecimal total = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        long days = Math.max(1, values.size());
        BigDecimal average = total.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);

        BigDecimal maxSale = values.stream().max(Comparator.naturalOrder()).orElse(BigDecimal.ZERO);
        BigDecimal minSale = values.stream().min(Comparator.naturalOrder()).orElse(BigDecimal.ZERO);

        // Simple growth: compare first half vs second half
        int half = values.size() / 2;
        BigDecimal firstHalf = values.subList(0, half).stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal secondHalf = values.subList(half, values.size()).stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal growthRate = firstHalf.compareTo(BigDecimal.ZERO) > 0
                ? secondHalf.subtract(firstHalf).multiply(BigDecimal.valueOf(100))
                .divide(firstHalf, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalSales", total);
        result.put("averageDailySales", average);
        result.put("maxDailySales", maxSale);
        result.put("minDailySales", minSale);
        result.put("halfPeriodGrowthRate", growthRate);
        result.put("trend", growthRate.compareTo(BigDecimal.ZERO) >= 0 ? "UPWARD" : "DOWNWARD");
        result.put("dailyBreakdown", daily);
        return result;
    }

    // ===================== CUSTOMER ANALYSIS =====================

    @Override
    public List<Map<String, Object>> getTopCustomers(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("Top customers for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);
        Map<Long, Map<String, Object>> customerMap = new LinkedHashMap<>();

        for (Sale sale : sales) {
            if (sale.getCustomer() == null) continue;
            Long cid = sale.getCustomer().getId();
            customerMap.computeIfAbsent(cid, id -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("customerId", id);
                m.put("customerName", sale.getCustomer().getCustomerName());
                m.put("customerPhone", sale.getCustomer().getPhone());
                m.put("totalPurchases", BigDecimal.ZERO);
                m.put("visitCount", 0);
                m.put("totalDiscount", BigDecimal.ZERO);
                return m;
            });
            Map<String, Object> c = customerMap.get(cid);
            c.put("totalPurchases", ((BigDecimal) c.get("totalPurchases")).add(sale.getTotalAmount()));
            c.put("visitCount", (int) c.get("visitCount") + 1);
            BigDecimal disc = sale.getDiscountAmount() != null ? sale.getDiscountAmount() : BigDecimal.ZERO;
            c.put("totalDiscount", ((BigDecimal) c.get("totalDiscount")).add(disc));
        }

        customerMap.values().forEach(m -> {
            int visits = (int) m.get("visitCount");
            BigDecimal total = (BigDecimal) m.get("totalPurchases");
            m.put("averagePurchaseValue", visits > 0
                    ? total.divide(BigDecimal.valueOf(visits), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO);
        });

        return customerMap.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalPurchases")).negate()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getCustomerPurchaseFrequency(Long branchId, LocalDate startDate, LocalDate endDate) {
        return getTopCustomers(branchId, startDate, endDate, Integer.MAX_VALUE).stream()
                .sorted(Comparator.comparingInt(m -> -(int) m.get("visitCount")))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getNewVsReturningCustomers(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("New vs returning customers for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);

        // Customers who made their first purchase in this period vs those who already existed
        Set<Long> customersInPeriod = new HashSet<>();
        Set<Long> returningCustomers = new HashSet<>();

        for (Sale sale : sales) {
            if (sale.getCustomer() == null) continue;
            Long cid = sale.getCustomer().getId();
            if (!customersInPeriod.add(cid)) {
                returningCustomers.add(cid);
            }
        }

        long newCount = customersInPeriod.size() - returningCustomers.size();
        long returningCount = returningCustomers.size();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUniqueCustomers", customersInPeriod.size());
        result.put("newCustomers", newCount);
        result.put("returningCustomers", returningCount);
        result.put("newCustomerRate", customersInPeriod.size() > 0
                ? Math.round((double) newCount / customersInPeriod.size() * 10000.0) / 100.0 : 0.0);
        return result;
    }

    // ===================== RETURNS ANALYSIS =====================

    @Override
    public Map<String, Object> getSalesReturnSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Sales return summary for branch {}", branchId);
        List<SaleReturn> returns = saleReturnRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));

        BigDecimal totalReturnValue = returns.stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalSales = getTotalSales(branchId, startDate, endDate);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalReturns", returns.size());
        summary.put("totalReturnValue", totalReturnValue);
        summary.put("totalSales", totalSales);
        summary.put("returnRatePercent", totalSales.compareTo(BigDecimal.ZERO) > 0
                ? totalReturnValue.multiply(BigDecimal.valueOf(100)).divide(totalSales, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        return summary;
    }

    @Override
    public Map<String, BigDecimal> getDailyReturnsTrend(Long branchId, LocalDate startDate, LocalDate endDate) {
        List<SaleReturn> returns = saleReturnRepository.findByBranchAndDateRange(
                branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        Map<String, BigDecimal> daily = new TreeMap<>();
        for (SaleReturn sr : returns) {
            if (sr.getReturnDate() == null) continue;
            String key = sr.getReturnDate().toLocalDate().toString();
            BigDecimal val = sr.getTotalAmount() != null ? sr.getTotalAmount() : BigDecimal.ZERO;
            daily.merge(key, val, BigDecimal::add);
        }
        return daily;
    }

    // ===================== DISCOUNT ANALYSIS =====================

    @Override
    public Map<String, Object> getDiscountAnalysisSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Discount analysis for branch {}", branchId);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);

        BigDecimal totalDiscount = sales.stream()
                .map(s -> s.getDiscountAmount() != null ? s.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalSales = sales.stream().map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        long discountedSalesCount = sales.stream().filter(s -> s.getDiscountAmount() != null
                && s.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0).count();

        BigDecimal grossRevenue = totalSales.add(totalDiscount);
        BigDecimal discountRate = grossRevenue.compareTo(BigDecimal.ZERO) > 0
                ? totalDiscount.multiply(BigDecimal.valueOf(100)).divide(grossRevenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalSales", totalSales);
        result.put("totalDiscount", totalDiscount);
        result.put("grossRevenue", grossRevenue);
        result.put("discountRatePercent", discountRate);
        result.put("discountedSalesCount", discountedSalesCount);
        result.put("totalSalesCount", sales.size());
        return result;
    }

    // ===================== COMPREHENSIVE DASHBOARD =====================

    @Override
    public Map<String, Object> getFullSalesDashboard(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Full sales dashboard for branch {} from {} to {}", branchId, startDate, endDate);
        List<Sale> sales = fetchCompleted(branchId, startDate, endDate);

        BigDecimal totalRevenue = sales.stream().map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalTransactions = sales.size();
        BigDecimal avgOrderValue = totalTransactions > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal totalDiscount = sales.stream()
                .map(s -> s.getDiscountAmount() != null ? s.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTax = sales.stream()
                .map(s -> s.getTaxAmount() != null ? s.getTaxAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Unique customers
        long uniqueCustomers = sales.stream().filter(s -> s.getCustomer() != null)
                .map(s -> s.getCustomer().getId()).distinct().count();

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("period", Map.of("startDate", startDate, "endDate", endDate));
        dashboard.put("totalRevenue", totalRevenue);
        dashboard.put("totalTransactions", totalTransactions);
        dashboard.put("averageOrderValue", avgOrderValue);
        dashboard.put("totalDiscount", totalDiscount);
        dashboard.put("totalTax", totalTax);
        dashboard.put("uniqueCustomers", uniqueCustomers);
        dashboard.put("dailySales", getDailySalesSummary(branchId, startDate, endDate));
        dashboard.put("salesByPaymentMethod", getSalesByPaymentMethod(branchId, startDate, endDate));
        dashboard.put("topProducts", getTopSellingProducts(branchId, startDate, endDate, 10));
        dashboard.put("topCustomers", getTopCustomers(branchId, startDate, endDate, 10));
        dashboard.put("returnSummary", getSalesReturnSummary(branchId, startDate, endDate));
        dashboard.put("discountAnalysis", getDiscountAnalysisSummary(branchId, startDate, endDate));
        dashboard.put("salesByDayOfWeek", getSalesByDayOfWeek(branchId, startDate, endDate));
        dashboard.put("trendAnalysis", getSalesTrendAnalysis(branchId, startDate, endDate));
        return dashboard;
    }
}