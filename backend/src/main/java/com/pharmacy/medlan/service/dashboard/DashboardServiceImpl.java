package com.pharmacy.medlan.service.dashboard;

import com.pharmacy.medlan.dto.response.dashboard.DashboardSummaryResponse;
import com.pharmacy.medlan.dto.response.dashboard.SalesAnalyticsResponse;
import com.pharmacy.medlan.dto.response.dashboard.InventoryAnalyticsResponse;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.inventory.GRNRepository;
import com.pharmacy.medlan.repository.notification.NotificationRepository;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.supplier.PurchaseOrderRepository;
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

/**
 * Advanced Dashboard Service Implementation
 * Provides comprehensive real-time analytics and KPIs
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final GRNRepository grnRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerRepository customerRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary(Long branchId) {
        log.info("Generating dashboard summary for branch: {}", branchId);
        
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
        
        // Get today's sales
        var todaySales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, todayStart, todayEnd);
        
        BigDecimal todayTotal = todaySales.stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED)
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long todayCount = todaySales.stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED)
                .count();
        
        // Get inventory alerts
        var alerts = getAlertCounts(branchId);
        
        return DashboardSummaryResponse.builder()
                .todaySummary(DashboardSummaryResponse.TodaySummary.builder()
                        .totalSales(todayTotal)
                        .salesCount(todayCount)
                        .totalPurchases(BigDecimal.ZERO)
                        .purchasesCount(0L)
                        .profit(BigDecimal.ZERO)
                        .newCustomers(0L)
                        .build())
                .monthlySummary(DashboardSummaryResponse.MonthlySummary.builder()
                        .totalSales(BigDecimal.ZERO)
                        .salesCount(0L)
                        .totalPurchases(BigDecimal.ZERO)
                        .totalProfit(BigDecimal.ZERO)
                        .averageDailySales(BigDecimal.ZERO)
                        .build())
                .inventoryAlerts(DashboardSummaryResponse.InventoryAlerts.builder()
                        .lowStockCount((long) alerts.get("lowStockCount"))
                        .outOfStockCount(0L)
                        .expiringCount((long) alerts.get("nearExpiryCount"))
                        .expiredCount(0L)
                        .build())
                .recentSales(new ArrayList<>())
                .topSellingProducts(new ArrayList<>())
                .build();
    }

    @Override
    public Map<String, Object> getTodaySales(Long branchId) {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
        
        var todaySales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, todayStart, todayEnd);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        int billCount = 0;
        
        Map<String, BigDecimal> paymentMethodBreakdown = new HashMap<>();
        paymentMethodBreakdown.put("CASH", BigDecimal.ZERO);
        paymentMethodBreakdown.put("CARD", BigDecimal.ZERO);
        paymentMethodBreakdown.put("UPI", BigDecimal.ZERO);
        paymentMethodBreakdown.put("CREDIT", BigDecimal.ZERO);
        
        for (var sale : todaySales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                totalAmount = totalAmount.add(sale.getTotalAmount());
                totalDiscount = totalDiscount.add(sale.getDiscountAmount());
                totalTax = totalTax.add(sale.getTaxAmount());
                billCount++;
                
                // Calculate profit
                BigDecimal saleCost = sale.getSaleItems().stream()
                        .map(item -> {
                            var batch = item.getInventoryBatch();
                            if (batch != null) {
                                return batch.getPurchasePrice()
                                        .multiply(BigDecimal.valueOf(item.getQuantity()));
                            }
                            return BigDecimal.ZERO;
                        })
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                BigDecimal saleProfit = sale.getTotalAmount().subtract(saleCost);
                totalProfit = totalProfit.add(saleProfit);
                
                // Payment method breakdown
                String paymentMethod = sale.getPaymentMethod().name();
                paymentMethodBreakdown.merge(paymentMethod, 
                        sale.getTotalAmount(), BigDecimal::add);
            }
        }
        
        BigDecimal averageBillValue = billCount > 0 
                ? totalAmount.divide(BigDecimal.valueOf(billCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        
        BigDecimal profitMargin = totalAmount.compareTo(BigDecimal.ZERO) > 0
                ? totalProfit.divide(totalAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalAmount", totalAmount);
        result.put("billCount", billCount);
        result.put("averageBillValue", averageBillValue);
        result.put("totalDiscount", totalDiscount);
        result.put("totalTax", totalTax);
        result.put("profit", totalProfit);
        result.put("profitMargin", profitMargin);
        result.put("paymentMethodBreakdown", paymentMethodBreakdown);
        
        // Compare with yesterday
        LocalDateTime yesterdayStart = today.minusDays(1).atStartOfDay();
        LocalDateTime yesterdayEnd = today.minusDays(1).atTime(LocalTime.MAX);
        
        BigDecimal yesterdayTotal = saleRepository
                .findByBranchIdAndSaleDateBetween(branchId, yesterdayStart, yesterdayEnd)
                .stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED)
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal changePercent = yesterdayTotal.compareTo(BigDecimal.ZERO) > 0
                ? totalAmount.subtract(yesterdayTotal)
                        .divide(yesterdayTotal, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;
        
        result.put("changeFromYesterday", changePercent);
        
        return result;
    }

    @Override
    public SalesAnalyticsResponse getSalesAnalytics(Long branchId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        var sales = saleRepository.findByBranchIdAndSaleDateBetween(branchId, start, end);
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        int totalBills = 0;
        Map<LocalDate, BigDecimal> dailyRevenue = new TreeMap<>();
        
        for (var sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                totalRevenue = totalRevenue.add(sale.getTotalAmount());
                totalDiscount = totalDiscount.add(sale.getDiscountAmount());
                totalBills++;
                
                LocalDate saleDate = sale.getSaleDate().toLocalDate();
                dailyRevenue.merge(saleDate, sale.getTotalAmount(), BigDecimal::add);
            }
        }
        
        BigDecimal averageDailySales = totalBills > 0
                ? totalRevenue.divide(BigDecimal.valueOf(
                        startDate.until(endDate).getDays() + 1), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        
        return SalesAnalyticsResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalSales(totalRevenue)
                .totalTransactions(totalBills)
                .averageOrderValue(totalBills > 0 ? 
                        totalRevenue.divide(BigDecimal.valueOf(totalBills), 2, RoundingMode.HALF_UP) 
                        : BigDecimal.ZERO)
                .build();
    }

    @Override
    public InventoryAnalyticsResponse getInventoryAnalytics(Long branchId) {
        List<Product> allProducts = productRepository.findByIsActiveTrueAndDeletedFalse();
        
        int totalProducts = allProducts.size();
        int productsInStock = 0;
        int lowStockCount = 0;
        int outOfStockCount = 0;
        BigDecimal totalInventoryValue = BigDecimal.ZERO;
        
        for (var product : allProducts) {
            Integer stock = inventoryBatchRepository
                    .sumAvailableQuantityByProductAndBranch(product.getId(), branchId);
            
            if (stock == null || stock == 0) {
                outOfStockCount++;
            } else {
                productsInStock++;
                
                if (stock <= product.getReorderLevel()) {
                    lowStockCount++;
                }
                
                // Calculate inventory value
                List<InventoryBatch> batches = inventoryBatchRepository
                        .findAvailableBatchesByProductAndBranch(product.getId(), branchId);
                
                for (InventoryBatch batch : batches) {
                    BigDecimal batchValue = batch.getPurchasePrice()
                            .multiply(BigDecimal.valueOf(batch.getQuantityAvailable()));
                    totalInventoryValue = totalInventoryValue.add(batchValue);
                }
            }
        }
        
        // Expiry analytics
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        
        int nearExpiryCount = inventoryBatchRepository
                .findByExpiryDateBetweenAndIsActiveAndIsExpired(
                        today, thirtyDaysFromNow, true, false)
                .size();
        
        int expiredCount = inventoryBatchRepository
                .findByExpiryDateBeforeAndIsExpiredFalse(today)
                .size();
        
        return InventoryAnalyticsResponse.builder()
                .branchId(branchId)
                .totalProducts(totalProducts)
                .inStockCount(productsInStock)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .expiringIn30Days(nearExpiryCount)
                .expiredCount(expiredCount)
                .totalStockValue(totalInventoryValue)
                .inventoryTurnoverRatio(calculateInventoryTurnover(branchId))
                .build();
    }

    @Override
    public List<Map<String, Object>> getTopSellingProducts(Long branchId, int limit) {
        log.info("Fetching top {} selling products for branch: {}", limit, branchId);
        
        // Get sales from last 30 days
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();
        
        var sales = saleRepository.findByBranchIdAndSaleDateBetween(branchId, startDate, endDate);
        
        // Aggregate quantities sold by product
        Map<Long, ProductSalesData> productSalesMap = new HashMap<>();
        
        for (var sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                for (var item : sale.getSaleItems()) {
                    Long productId = item.getProduct().getId();
                    ProductSalesData data = productSalesMap.computeIfAbsent(productId, 
                            k -> new ProductSalesData(item.getProduct()));
                    
                    data.addSale(item.getQuantity(), 
                            item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }
        
        // Sort by quantity sold and get top N
        return productSalesMap.values().stream()
                .sorted((a, b) -> Integer.compare(b.getQuantitySold(), a.getQuantitySold()))
                .limit(limit)
                .map(data -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("productId", data.getProduct().getId());
                    result.put("productCode", data.getProduct().getProductCode());
                    result.put("productName", data.getProduct().getProductName());
                    result.put("quantitySold", data.getQuantitySold());
                    result.put("revenue", data.getRevenue());
                    result.put("category", data.getProduct().getCategory() != null ? 
                            data.getProduct().getCategory().getCategoryName() : "N/A");
                    return result;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getSlowMovingProducts(Long branchId, int daysSinceLastSale) {
        log.info("Fetching slow moving products (no sale in {} days) for branch: {}", 
                daysSinceLastSale, branchId);
        
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysSinceLastSale);
        List<Map<String, Object>> slowMovingProducts = new ArrayList<>();
        
        var allProducts = productRepository.findByIsActiveTrueAndDeletedFalse();
        
        for (var product : allProducts) {
            // Check if product has stock at this branch
            Integer stock = inventoryBatchRepository
                    .sumAvailableQuantityByProductAndBranch(product.getId(), branchId);
            
            if (stock != null && stock > 0) {
                // Check last sale date
                var lastSale = saleRepository.findLastSaleForProduct(product.getId(), branchId);
                
                boolean isSlowMoving = false;
                Long daysSinceLastSold = null;
                
                if (lastSale.isEmpty()) {
                    // Never sold
                    isSlowMoving = true;
                } else {
                    LocalDateTime lastSaleDate = lastSale.get().getSaleDate();
                    if (lastSaleDate.isBefore(cutoffDate)) {
                        isSlowMoving = true;
                        daysSinceLastSold = ChronoUnit.DAYS.between(lastSaleDate.toLocalDate(), 
                                LocalDate.now());
                    }
                }
                
                if (isSlowMoving) {
                    // Calculate inventory value
                    var batches = inventoryBatchRepository
                            .findAvailableBatchesByProductAndBranch(product.getId(), branchId);
                    BigDecimal inventoryValue = batches.stream()
                            .map(b -> b.getPurchasePrice()
                                    .multiply(BigDecimal.valueOf(b.getQuantityAvailable())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    Map<String, Object> slowProduct = new HashMap<>();
                    slowProduct.put("productId", product.getId());
                    slowProduct.put("productCode", product.getProductCode());
                    slowProduct.put("productName", product.getProductName());
                    slowProduct.put("quantityInStock", stock);
                    slowProduct.put("inventoryValue", inventoryValue);
                    slowProduct.put("daysSinceLastSale", daysSinceLastSold);
                    slowProduct.put("neverSold", lastSale.isEmpty());
                    slowProduct.put("category", product.getCategory() != null ? 
                            product.getCategory().getCategoryName() : "N/A");
                    
                    slowMovingProducts.add(slowProduct);
                }
            }
        }
        
        // Sort by days since last sale (descending) or value (for never sold items)
        slowMovingProducts.sort((a, b) -> {
            Boolean aNeverSold = (Boolean) a.get("neverSold");
            Boolean bNeverSold = (Boolean) b.get("neverSold");
            
            if (aNeverSold && bNeverSold) {
                return ((BigDecimal) b.get("inventoryValue"))
                        .compareTo((BigDecimal) a.get("inventoryValue"));
            } else if (aNeverSold) {
                return -1;
            } else if (bNeverSold) {
                return 1;
            } else {
                return ((Long) b.get("daysSinceLastSale"))
                        .compareTo((Long) a.get("daysSinceLastSale"));
            }
        });
        
        return slowMovingProducts;
    }

    @Override
    public Map<String, Object> getRevenueTrends(Long branchId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        SalesAnalyticsResponse analytics = getSalesAnalytics(branchId, startDate, endDate);
        Map<String, Object> trends = new HashMap<>();
        trends.put("totalSales", analytics.getTotalSales());
        trends.put("totalTransactions", analytics.getTotalTransactions());
        trends.put("averageOrderValue", analytics.getAverageOrderValue());
        return trends;
    }

    @Override
    public List<Map<String, Object>> getStaffPerformance(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching staff performance for branch: {} from {} to {}", 
                branchId, startDate, endDate);
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        var sales = saleRepository.findByBranchIdAndSaleDateBetween(branchId, start, end);
        
        // Aggregate by staff member
        Map<Long, StaffPerformanceData> staffPerformanceMap = new HashMap<>();
        
        for (var sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED && sale.getSoldBy() != null) {
                Long userId = sale.getSoldBy().getId();
                StaffPerformanceData data = staffPerformanceMap.computeIfAbsent(userId,
                        k -> new StaffPerformanceData(sale.getSoldBy()));
                
                data.addSale(sale.getTotalAmount(), sale.getDiscountAmount());
            }
        }
        
        // Convert to list and sort by revenue
        return staffPerformanceMap.values().stream()
                .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
                .map(data -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("userId", data.getUser().getId());
                    result.put("username", data.getUser().getUsername());
                    result.put("fullName", data.getUser().getFullName());
                    result.put("role", data.getUser().getRole().name());
                    result.put("totalSales", data.getSalesCount());
                    result.put("totalRevenue", data.getTotalRevenue());
                    result.put("averageSaleValue", data.getAverageSaleValue());
                    result.put("totalDiscount", data.getTotalDiscount());
                    result.put("discountPercentage", data.getDiscountPercentage());
                    return result;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getCustomerInsights(Long branchId) {
        log.info("Fetching customer insights for branch: {}", branchId);
        Map<String, Object> insights = new HashMap<>();
        
        // Basic customer counts
        Long totalCustomers = customerRepository.count();
        
        // Get customers with recent purchases (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        var recentSales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, thirtyDaysAgo, LocalDateTime.now());
        
        Set<Long> activeCustomerIds = recentSales.stream()
                .filter(s -> s.getCustomer() != null)
                .map(s -> s.getCustomer().getId())
                .collect(Collectors.toSet());
        
        Long activeCustomers = (long) activeCustomerIds.size();
        
        // Get repeat customers (more than 5 purchases)
        Map<Long, Long> customerPurchaseCount = new HashMap<>();
        var allSales = saleRepository.findByBranchId(branchId);
        
        for (var sale : allSales) {
            if (sale.getCustomer() != null) {
                customerPurchaseCount.merge(sale.getCustomer().getId(), 1L, Long::sum);
            }
        }
        
        Long repeatCustomers = customerPurchaseCount.values().stream()
                .filter(count -> count > 5)
                .count();
        
        // Calculate walk-in vs registered sales
        long walkInSales = recentSales.stream()
                .filter(s -> s.getCustomer() == null)
                .count();
        long registeredSales = recentSales.stream()
                .filter(s -> s.getCustomer() != null)
                .count();
        
        // Average purchase value for registered customers
        BigDecimal registeredCustomerAvg = recentSales.stream()
                .filter(s -> s.getCustomer() != null)
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (registeredSales > 0) {
            registeredCustomerAvg = registeredCustomerAvg.divide(
                    BigDecimal.valueOf(registeredSales), 2, RoundingMode.HALF_UP);
        }
        
        insights.put("totalCustomers", totalCustomers);
        insights.put("activeCustomers", activeCustomers);
        insights.put("repeatCustomers", repeatCustomers);
        insights.put("walkInSales", walkInSales);
        insights.put("registeredSales", registeredSales);
        insights.put("registeredCustomerPercentage", 
                recentSales.size() > 0 ? 
                        (registeredSales * 100.0) / recentSales.size() : 0.0);
        insights.put("averagePurchaseValue", registeredCustomerAvg);
        
        return insights;
    }

    @Override
    public Map<String, Integer> getAlertCounts(Long branchId) {
        log.info("Fetching alert counts for branch: {}", branchId);
        Map<String, Integer> alerts = new HashMap<>();
        
        // Count pending PO approvals
        int pendingPOs = purchaseOrderRepository
                .countByBranchIdAndStatus(branchId, "PENDING_APPROVAL");
        alerts.put("pendingPOApprovals", pendingPOs);
        
        // Count pending GRN approvals
        int pendingGRNs = grnRepository
                .countByBranchIdAndStatus(branchId, "PENDING_APPROVAL");
        alerts.put("pendingGRNApprovals", pendingGRNs);
        
        // Count overdue GRN payments
        int overduePayments = grnRepository
                .countOverduePayments(branchId);
        alerts.put("overduePayments", overduePayments);
        
        // Count unread notifications for branch users
        int unreadNotifications = notificationRepository
                .countByIsRead(false);
        alerts.put("unreadNotifications", unreadNotifications);
        
        // Low stock products
        int lowStockCount = 0;
        var products = productRepository.findByIsActiveTrueAndDeletedFalse();
        for (var product : products) {
            Integer stock = inventoryBatchRepository
                    .sumAvailableQuantityByProductAndBranch(product.getId(), branchId);
            if (stock != null && stock <= product.getReorderLevel()) {
                lowStockCount++;
            }
        }
        alerts.put("lowStockCount", lowStockCount);
        
        // Near expiry items (30 days)
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        int nearExpiryCount = inventoryBatchRepository
                .countByBranchIdAndExpiryDateBetween(branchId, today, thirtyDaysFromNow);
        alerts.put("nearExpiryCount", nearExpiryCount);
        
        return alerts;
    }

    private Map<String, Object> calculateFinancialMetrics(Long branchId) {
        log.info("Calculating financial metrics for branch: {}", branchId);
        Map<String, Object> metrics = new HashMap<>();
        
        // Calculate pending credit from credit sales
        LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
        var creditSales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, last30Days, LocalDateTime.now());
        
        BigDecimal pendingCredit = creditSales.stream()
                .filter(s -> s.getPaymentMethod().name().equals("CREDIT") && 
                             s.getStatus() == SaleStatus.COMPLETED)
                .map(s -> s.getTotalAmount().subtract(s.getPaidAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        metrics.put("pendingCredit", pendingCredit);
        
        // Calculate accounts payable from GRNs
        var pendingGRNs = grnRepository.findByBranchIdAndPaymentStatus(
                branchId, "UNPAID", "PARTIALLY_PAID");
        
        BigDecimal accountsPayable = pendingGRNs.stream()
                .map(grn -> grn.getBalanceAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        metrics.put("accountsPayable", accountsPayable);
        
        // Calculate today's cash collection
        LocalDate today = LocalDate.now();
        var todaySales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, today.atStartOfDay(), today.atTime(LocalTime.MAX));
        
        BigDecimal cashInHand = todaySales.stream()
                .filter(s -> s.getPaymentMethod().name().equals("CASH") && 
                             s.getStatus() == SaleStatus.COMPLETED)
                .map(s -> s.getPaidAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        metrics.put("cashInHand", cashInHand);
        
        // Calculate this month's revenue
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        var monthlySales = saleRepository.findByBranchIdAndSaleDateBetween(
                branchId, firstDayOfMonth.atStartOfDay(), LocalDateTime.now());
        
        BigDecimal monthlyRevenue = monthlySales.stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED)
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        metrics.put("monthlyRevenue", monthlyRevenue);
        
        return metrics;
    }

    private BigDecimal calculateInventoryTurnover(Long branchId) {
        log.info("Calculating inventory turnover for branch: {}", branchId);
        
        // Calculate for last 30 days
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();
        
        // Calculate Cost of Goods Sold (COGS)
        var sales = saleRepository.findByBranchIdAndSaleDateBetween(branchId, startDate, endDate);
        
        BigDecimal cogs = BigDecimal.ZERO;
        for (var sale : sales) {
            if (sale.getStatus() == SaleStatus.COMPLETED) {
                for (var item : sale.getSaleItems()) {
                    if (item.getInventoryBatch() != null) {
                        BigDecimal itemCost = item.getInventoryBatch().getPurchasePrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()));
                        cogs = cogs.add(itemCost);
                    }
                }
            }
        }
        
        // Calculate current inventory value
        var allProducts = productRepository.findByIsActiveTrueAndDeletedFalse();
        BigDecimal currentInventoryValue = BigDecimal.ZERO;
        
        for (var product : allProducts) {
            var batches = inventoryBatchRepository
                    .findAvailableBatchesByProductAndBranch(product.getId(), branchId);
            
            for (var batch : batches) {
                BigDecimal batchValue = batch.getPurchasePrice()
                        .multiply(BigDecimal.valueOf(batch.getQuantityAvailable()));
                currentInventoryValue = currentInventoryValue.add(batchValue);
            }
        }
        
        // Inventory Turnover = COGS / Average Inventory
        // Using current inventory as approximation for average
        if (currentInventoryValue.compareTo(BigDecimal.ZERO) > 0) {
            return cogs.divide(currentInventoryValue, 2, RoundingMode.HALF_UP);
        }
        
        return BigDecimal.ZERO;
    }
    
    // Inner classes for data aggregation
    private static class ProductSalesData {
        private final Product product;
        private int quantitySold = 0;
        private BigDecimal revenue = BigDecimal.ZERO;
        
        public ProductSalesData(Product product) {
            this.product = product;
        }
        
        public void addSale(int quantity, BigDecimal amount) {
            this.quantitySold += quantity;
            this.revenue = this.revenue.add(amount);
        }
        
        public Product getProduct() { return product; }
        public int getQuantitySold() { return quantitySold; }
        public BigDecimal getRevenue() { return revenue; }
    }
    
    private static class StaffPerformanceData {
        private final User user;
        private int salesCount = 0;
        private BigDecimal totalRevenue = BigDecimal.ZERO;
        private BigDecimal totalDiscount = BigDecimal.ZERO;
        
        public StaffPerformanceData(User user) {
            this.user = user;
        }
        
        public void addSale(BigDecimal amount, BigDecimal discount) {
            this.salesCount++;
            this.totalRevenue = this.totalRevenue.add(amount);
            this.totalDiscount = this.totalDiscount.add(discount);
        }
        
        public User getUser() { return user; }
        public int getSalesCount() { return salesCount; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public BigDecimal getTotalDiscount() { return totalDiscount; }
        
        public BigDecimal getAverageSaleValue() {
            return salesCount > 0 ? 
                    totalRevenue.divide(BigDecimal.valueOf(salesCount), 2, RoundingMode.HALF_UP) :
                    BigDecimal.ZERO;
        }
        
        public BigDecimal getDiscountPercentage() {
            return totalRevenue.compareTo(BigDecimal.ZERO) > 0 ?
                    totalDiscount.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)) :
                    BigDecimal.ZERO;
        }
    }
}
