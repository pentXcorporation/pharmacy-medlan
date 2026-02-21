package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.model.pos.SaleItem;
import com.pharmacy.medlan.model.pos.SaleReturn;
import com.pharmacy.medlan.model.pos.SaleReturnItem;
import com.pharmacy.medlan.model.product.*;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.pos.SaleReturnRepository;
import com.pharmacy.medlan.repository.product.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductReportServiceImpl implements ProductReportService {

    private final SaleRepository saleRepository;
    private final SaleReturnRepository saleReturnRepository;
    private final ProductRepository productRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final InventoryBatchRepository inventoryBatchRepository;

    // ===================== HELPER =====================

    private List<Sale> fetchCompletedSales(Long branchId, LocalDate startDate, LocalDate endDate) {
        return saleRepository.findByBranchAndDateRange(
                        branchId, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX))
                .stream()
                .filter(s -> s.getStatus() == SaleStatus.COMPLETED)
                .collect(Collectors.toList());
    }

    private Map<Long, Map<String, Object>> buildProductSalesMap(List<Sale> sales) {
        Map<Long, Map<String, Object>> map = new LinkedHashMap<>();
        for (Sale sale : sales) {
            if (sale.getSaleItems() == null) continue;
            for (SaleItem item : sale.getSaleItems()) {
                if (item.getProduct() == null) continue;
                Long productId = item.getProduct().getId();
                map.computeIfAbsent(productId, id -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("productId", id);
                    m.put("productName", item.getProduct().getProductName());
                    m.put("productCode", item.getProduct().getProductCode());
                    m.put("category", item.getProduct().getCategory() != null
                            ? item.getProduct().getCategory().getCategoryName() : "Uncategorized");
                    m.put("subCategory", item.getProduct().getSubCategory() != null
                            ? item.getProduct().getSubCategory().getSubCategoryName() : "N/A");
                    m.put("totalQuantitySold", 0);
                    m.put("totalRevenue", BigDecimal.ZERO);
                    m.put("totalCost", BigDecimal.ZERO);
                    m.put("totalDiscount", BigDecimal.ZERO);
                    m.put("transactionCount", 0);
                    return m;
                });

                Map<String, Object> p = map.get(productId);
                p.put("totalQuantitySold", (int) p.get("totalQuantitySold") + item.getQuantity());
                p.put("totalRevenue", ((BigDecimal) p.get("totalRevenue")).add(item.getTotalAmount()));
                p.put("transactionCount", (int) p.get("transactionCount") + 1);
                BigDecimal disc = item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO;
                p.put("totalDiscount", ((BigDecimal) p.get("totalDiscount")).add(disc));
                if (item.getCostPrice() != null) {
                    BigDecimal cost = item.getCostPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    p.put("totalCost", ((BigDecimal) p.get("totalCost")).add(cost));
                }
            }
        }
        // Compute derived fields
        map.values().forEach(m -> {
            BigDecimal revenue = (BigDecimal) m.get("totalRevenue");
            BigDecimal cost = (BigDecimal) m.get("totalCost");
            BigDecimal grossProfit = revenue.subtract(cost);
            BigDecimal margin = revenue.compareTo(BigDecimal.ZERO) > 0
                    ? grossProfit.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            m.put("grossProfit", grossProfit);
            m.put("grossMarginPercent", margin);
        });
        return map;
    }

    // ===================== PRODUCT PERFORMANCE =====================

    @Override
    public List<Map<String, Object>> getTopSellingProductsByQuantity(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("Top products by quantity for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .sorted(Comparator.comparingInt(m -> -(int) m.get("totalQuantitySold")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopSellingProductsByRevenue(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("Top products by revenue for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalRevenue")).negate()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getSlowestMovingProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("Slowest moving products for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .filter(m -> (int) m.get("totalQuantitySold") > 0)
                .sorted(Comparator.comparingInt(m -> (int) m.get("totalQuantitySold")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getNeverSoldProducts(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Never sold products for branch {}", branchId);
        Map<Long, Map<String, Object>> soldMap = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        Set<Long> soldIds = soldMap.keySet();

        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        return inventories.stream()
                .filter(bi -> !soldIds.contains(bi.getProduct().getId()))
                .filter(bi -> bi.getQuantityOnHand() > 0)
                .map(bi -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("productId", bi.getProduct().getId());
                    row.put("productName", bi.getProduct().getProductName());
                    row.put("productCode", bi.getProduct().getProductCode());
                    row.put("category", bi.getProduct().getCategory() != null
                            ? bi.getProduct().getCategory().getCategoryName() : "Uncategorized");
                    row.put("currentStock", bi.getQuantityOnHand());
                    return row;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getProductSalesVelocity(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Product sales velocity for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        long days = Math.max(1, ChronoUnit.DAYS.between(startDate, endDate) + 1);

        return map.values().stream().map(m -> {
                    Map<String, Object> row = new LinkedHashMap<>(m);
                    int qty = (int) m.get("totalQuantitySold");
                    row.put("dailyVelocity", Math.round((double) qty / days * 100.0) / 100.0);
                    row.put("periodDays", days);
                    return row;
                })
                .sorted(Comparator.comparingDouble(m -> -(double) m.get("dailyVelocity")))
                .collect(Collectors.toList());
    }

    // ===================== CATEGORY ANALYSIS =====================

    @Override
    public List<Map<String, Object>> getSalesByCategory(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Sales by category for branch {}", branchId);
        Map<Long, Map<String, Object>> productMap = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        Map<String, Map<String, Object>> categoryMap = new LinkedHashMap<>();

        productMap.values().forEach(p -> {
            String cat = (String) p.get("category");
            categoryMap.computeIfAbsent(cat, c -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("category", c);
                m.put("productCount", 0);
                m.put("totalQuantitySold", 0);
                m.put("totalRevenue", BigDecimal.ZERO);
                m.put("totalCost", BigDecimal.ZERO);
                m.put("grossProfit", BigDecimal.ZERO);
                return m;
            });
            Map<String, Object> c = categoryMap.get(cat);
            c.put("productCount", (int) c.get("productCount") + 1);
            c.put("totalQuantitySold", (int) c.get("totalQuantitySold") + (int) p.get("totalQuantitySold"));
            c.put("totalRevenue", ((BigDecimal) c.get("totalRevenue")).add((BigDecimal) p.get("totalRevenue")));
            c.put("totalCost", ((BigDecimal) c.get("totalCost")).add((BigDecimal) p.get("totalCost")));
            c.put("grossProfit", ((BigDecimal) c.get("grossProfit")).add((BigDecimal) p.get("grossProfit")));
        });

        categoryMap.values().forEach(c -> {
            BigDecimal rev = (BigDecimal) c.get("totalRevenue");
            BigDecimal profit = (BigDecimal) c.get("grossProfit");
            c.put("grossMarginPercent", rev.compareTo(BigDecimal.ZERO) > 0
                    ? profit.multiply(BigDecimal.valueOf(100)).divide(rev, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO);
        });

        return categoryMap.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalRevenue")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getSalesBySubCategory(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Sales by sub-category for branch {}", branchId);
        Map<Long, Map<String, Object>> productMap = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        Map<String, Map<String, Object>> subCatMap = new LinkedHashMap<>();

        productMap.values().forEach(p -> {
            String subCat = (String) p.get("subCategory");
            subCatMap.computeIfAbsent(subCat, sc -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("subCategory", sc);
                m.put("totalRevenue", BigDecimal.ZERO);
                m.put("totalQuantitySold", 0);
                return m;
            });
            Map<String, Object> sc = subCatMap.get(subCat);
            sc.put("totalRevenue", ((BigDecimal) sc.get("totalRevenue")).add((BigDecimal) p.get("totalRevenue")));
            sc.put("totalQuantitySold", (int) sc.get("totalQuantitySold") + (int) p.get("totalQuantitySold"));
        });

        return subCatMap.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalRevenue")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getStockAnalysisByCategory(Long branchId) {
        log.info("Stock analysis by category for branch {}", branchId);
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        Map<String, Map<String, Object>> categoryMap = new LinkedHashMap<>();

        for (BranchInventory bi : inventories) {
            String cat = bi.getProduct().getCategory() != null
                    ? bi.getProduct().getCategory().getCategoryName() : "Uncategorized";

            categoryMap.computeIfAbsent(cat, c -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("category", c);
                m.put("productCount", 0);
                m.put("totalQuantity", 0);
                m.put("stockValue", BigDecimal.ZERO);
                return m;
            });

            List<InventoryBatch> batches = inventoryBatchRepository
                    .findByProductIdAndBranchId(bi.getProduct().getId(), branchId);
            BigDecimal batchValue = batches.stream()
                    .filter(b -> b.getQuantityAvailable() > 0)
                    .map(b -> b.getPurchasePrice().multiply(BigDecimal.valueOf(b.getQuantityAvailable())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> c = categoryMap.get(cat);
            c.put("productCount", (int) c.get("productCount") + 1);
            c.put("totalQuantity", (int) c.get("totalQuantity") + bi.getQuantityOnHand());
            c.put("stockValue", ((BigDecimal) c.get("stockValue")).add(batchValue));
        }

        BigDecimal totalValue = categoryMap.values().stream()
                .map(c -> (BigDecimal) c.get("stockValue"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalStockValue", totalValue);
        result.put("categories", categoryMap.values());
        return result;
    }

    @Override
    public List<Map<String, Object>> getProductCountByCategory(Long branchId) {
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        Map<String, Map<String, Object>> catMap = new LinkedHashMap<>();

        for (BranchInventory bi : inventories) {
            String cat = bi.getProduct().getCategory() != null
                    ? bi.getProduct().getCategory().getCategoryName() : "Uncategorized";
            catMap.computeIfAbsent(cat, c -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("category", c);
                m.put("totalProducts", 0);
                m.put("inStockProducts", 0);
                m.put("outOfStockProducts", 0);
                m.put("lowStockProducts", 0);
                return m;
            });

            Map<String, Object> c = catMap.get(cat);
            c.put("totalProducts", (int) c.get("totalProducts") + 1);
            int qty = bi.getQuantityAvailable();
            if (qty <= 0) c.put("outOfStockProducts", (int) c.get("outOfStockProducts") + 1);
            else if (qty < bi.getReorderLevel()) c.put("lowStockProducts", (int) c.get("lowStockProducts") + 1);
            else c.put("inStockProducts", (int) c.get("inStockProducts") + 1);
        }
        return new ArrayList<>(catMap.values());
    }

    // ===================== MARGIN & PROFITABILITY =====================

    @Override
    public List<Map<String, Object>> getProductMarginReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Product margin report for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("grossMarginPercent")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getHighestMarginProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        return getProductMarginReport(branchId, startDate, endDate).stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getLowestMarginProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .sorted(Comparator.comparing(m -> (BigDecimal) m.get("grossMarginPercent")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getProductProfitContribution(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Product profit contribution for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));

        BigDecimal totalProfit = map.values().stream()
                .map(m -> (BigDecimal) m.get("grossProfit"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return map.values().stream().map(m -> {
                    Map<String, Object> row = new LinkedHashMap<>(m);
                    BigDecimal profit = (BigDecimal) m.get("grossProfit");
                    row.put("profitContributionPercent", totalProfit.compareTo(BigDecimal.ZERO) > 0
                            ? profit.multiply(BigDecimal.valueOf(100)).divide(totalProfit, 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO);
                    return row;
                })
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("grossProfit")).negate()))
                .collect(Collectors.toList());
    }

    // ===================== PRICING & RETURNS =====================

    @Override
    public List<Map<String, Object>> getHighReturnRateProducts(Long branchId, LocalDate startDate, LocalDate endDate, int limit) {
        log.info("High return rate products for branch {}", branchId);
        Map<Long, Map<String, Object>> salesMap = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));

        // Aggregate returns
        List<SaleReturn> returns = saleReturnRepository.findByBranchId(branchId).stream()
                .filter(r -> r.getReturnDate() != null && !r.getReturnDate().isBefore(startDate) && !r.getReturnDate().isAfter(endDate))
                .collect(Collectors.toList());

        Map<Long, Integer> returnQtyMap = new HashMap<>();
        for (SaleReturn sr : returns) {
            if (sr.getReturnItems() == null) continue;
            for (SaleReturnItem ri : sr.getReturnItems()) {
                if (ri.getProduct() != null) {
                    returnQtyMap.merge(ri.getProduct().getId(), ri.getQuantityReturned(), Integer::sum);
                }
            }
        }

        return salesMap.values().stream().map(m -> {
                    Long pid = (Long) m.get("productId");
                    int soldQty = (int) m.get("totalQuantitySold");
                    int returnedQty = returnQtyMap.getOrDefault(pid, 0);
                    double returnRate = soldQty > 0 ? (double) returnedQty / soldQty * 100 : 0.0;
                    Map<String, Object> row = new LinkedHashMap<>(m);
                    row.put("returnedQuantity", returnedQty);
                    row.put("returnRatePercent", Math.round(returnRate * 100.0) / 100.0);
                    return row;
                })
                .filter(m -> (double) m.get("returnRatePercent") > 0)
                .sorted(Comparator.comparingDouble(m -> -(double) m.get("returnRatePercent")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getProductDiscountAnalysis(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Product discount analysis for branch {}", branchId);
        Map<Long, Map<String, Object>> map = buildProductSalesMap(fetchCompletedSales(branchId, startDate, endDate));
        return map.values().stream()
                .filter(m -> ((BigDecimal) m.get("totalDiscount")).compareTo(BigDecimal.ZERO) > 0)
                .map(m -> {
                    Map<String, Object> row = new LinkedHashMap<>(m);
                    BigDecimal revenue = (BigDecimal) m.get("totalRevenue");
                    BigDecimal discount = (BigDecimal) m.get("totalDiscount");
                    BigDecimal grossWithDiscount = revenue.add(discount);
                    row.put("discountPercent", grossWithDiscount.compareTo(BigDecimal.ZERO) > 0
                            ? discount.multiply(BigDecimal.valueOf(100)).divide(grossWithDiscount, 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO);
                    return row;
                })
                .sorted(Comparator.comparing(m -> ((BigDecimal) m.get("totalDiscount")).negate()))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<Map<String, Object>>> getProductsByPriceRange(Long branchId) {
        log.info("Products by price range for branch {}", branchId);
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        Map<String, List<Map<String, Object>>> ranges = new LinkedHashMap<>();
        ranges.put("Under 100", new ArrayList<>());
        ranges.put("100-500", new ArrayList<>());
        ranges.put("500-1000", new ArrayList<>());
        ranges.put("1000-5000", new ArrayList<>());
        ranges.put("5000+", new ArrayList<>());

        for (BranchInventory bi : inventories) {
            Product p = bi.getProduct();
            BigDecimal price = p.getSellingPrice() != null ? p.getSellingPrice() : BigDecimal.ZERO;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("productId", p.getId());
            row.put("productName", p.getProductName());
            row.put("productCode", p.getProductCode());
            row.put("sellingPrice", price);
            row.put("currentStock", bi.getQuantityOnHand());

            double priceVal = price.doubleValue();
            if (priceVal < 100)           ranges.get("Under 100").add(row);
            else if (priceVal < 500)      ranges.get("100-500").add(row);
            else if (priceVal < 1000)     ranges.get("500-1000").add(row);
            else if (priceVal < 5000)     ranges.get("1000-5000").add(row);
            else                          ranges.get("5000+").add(row);
        }
        return ranges;
    }

    // ===================== BATCH & EXPIRY TRACKING =====================

    @Override
    public List<Map<String, Object>> getProductBatchReport(Long branchId) {
        log.info("Product batch report for branch {}", branchId);
        List<InventoryBatch> batches = inventoryBatchRepository.findByBranchId(branchId);
        LocalDate today = LocalDate.now();

        return batches.stream().map(b -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("batchId", b.getId());
                    row.put("productId", b.getProduct().getId());
                    row.put("productName", b.getProduct().getProductName());
                    row.put("productCode", b.getProduct().getProductCode());
                    row.put("batchNumber", b.getBatchNumber());
                    row.put("quantityReceived", b.getQuantityReceived());
                    row.put("quantityAvailable", b.getQuantityAvailable());
                    row.put("quantitySold", b.getQuantityReceived() - b.getQuantityAvailable());
                    row.put("purchasePrice", b.getPurchasePrice());
                    row.put("sellingPrice", b.getSellingPrice());
                    row.put("manufactureDate", b.getManufacturingDate());
                    row.put("expiryDate", b.getExpiryDate());
                    long daysToExpiry = b.getExpiryDate() != null
                            ? ChronoUnit.DAYS.between(today, b.getExpiryDate()) : Long.MAX_VALUE;
                    row.put("daysToExpiry", daysToExpiry == Long.MAX_VALUE ? "N/A" : daysToExpiry);
                    row.put("expiryStatus",
                            daysToExpiry < 0 ? "EXPIRED" :
                                    daysToExpiry <= 30 ? "CRITICAL" :
                                            daysToExpiry <= 90 ? "WARNING" : "OK");
                    row.put("batchValue", b.getPurchasePrice().multiply(BigDecimal.valueOf(b.getQuantityAvailable())));
                    return row;
                })
                .sorted(Comparator.comparing(m -> m.get("expiryDate") != null ? m.get("expiryDate").toString() : "9999"))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getMultiBatchProducts(Long branchId) {
        log.info("Multi-batch products for branch {}", branchId);
        List<InventoryBatch> batches = inventoryBatchRepository.findByBranchId(branchId)
                .stream().filter(b -> b.getQuantityAvailable() > 0).collect(Collectors.toList());

        Map<Long, List<InventoryBatch>> productBatches = batches.stream()
                .collect(Collectors.groupingBy(b -> b.getProduct().getId()));

        return productBatches.entrySet().stream()
                .filter(e -> e.getValue().size() > 1)
                .map(e -> {
                    List<InventoryBatch> pBatches = e.getValue();
                    InventoryBatch first = pBatches.get(0);
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("productId", e.getKey());
                    row.put("productName", first.getProduct().getProductName());
                    row.put("activeBatchCount", pBatches.size());
                    row.put("totalStock", pBatches.stream().mapToInt(InventoryBatch::getQuantityAvailable).sum());
                    row.put("batches", pBatches.stream().map(b -> Map.of(
                            "batchNumber", b.getBatchNumber(),
                            "quantity", b.getQuantityAvailable(),
                            "expiryDate", b.getExpiryDate() != null ? b.getExpiryDate().toString() : "N/A"
                    )).collect(Collectors.toList()));
                    return row;
                })
                .sorted(Comparator.comparingInt(m -> -(int) m.get("activeBatchCount")))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getExpiryLossProjection(Long branchId, int days) {
        log.info("Expiry loss projection for next {} days at branch {}", days, branchId);
        LocalDate alertDate = LocalDate.now().plusDays(days);
        List<InventoryBatch> expiring = inventoryBatchRepository.findExpiringBatchesForAlert(branchId, alertDate);

        BigDecimal projectedLoss = BigDecimal.ZERO;
        int totalUnitsAtRisk = 0;
        List<Map<String, Object>> items = new ArrayList<>();

        for (InventoryBatch b : expiring) {
            BigDecimal value = b.getPurchasePrice().multiply(BigDecimal.valueOf(b.getQuantityAvailable()));
            projectedLoss = projectedLoss.add(value);
            totalUnitsAtRisk += b.getQuantityAvailable();

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productName", b.getProduct().getProductName());
            item.put("batchNumber", b.getBatchNumber());
            item.put("quantity", b.getQuantityAvailable());
            item.put("expiryDate", b.getExpiryDate());
            item.put("daysToExpiry", b.getExpiryDate() != null
                    ? ChronoUnit.DAYS.between(LocalDate.now(), b.getExpiryDate()) : "N/A");
            item.put("projectedLoss", value);
            items.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("daysWindow", days);
        result.put("totalProductsAtRisk", expiring.size());
        result.put("totalUnitsAtRisk", totalUnitsAtRisk);
        result.put("totalProjectedLoss", projectedLoss);
        result.put("items", items);
        return result;
    }

    // ===================== PRODUCT MASTER =====================

    @Override
    public List<Map<String, Object>> getProductMasterReport(Long branchId) {
        log.info("Product master report for branch {}", branchId);
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);

        return inventories.stream().map(bi -> {
            Product p = bi.getProduct();
            List<InventoryBatch> batches = inventoryBatchRepository
                    .findByProductIdAndBranchId(p.getId(), branchId);
            int batchCount = (int) batches.stream().filter(b -> b.getQuantityAvailable() > 0).count();
            Optional<LocalDate> nearestExpiry = batches.stream()
                    .filter(b -> b.getExpiryDate() != null && b.getQuantityAvailable() > 0)
                    .map(InventoryBatch::getExpiryDate)
                    .min(Comparator.naturalOrder());

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("productId", p.getId());
            row.put("productCode", p.getProductCode());
            row.put("productName", p.getProductName());
            row.put("genericName", p.getGenericName());
            row.put("category", p.getCategory() != null ? p.getCategory().getCategoryName() : "N/A");
            row.put("subCategory", p.getSubCategory() != null ? p.getSubCategory().getSubCategoryName() : "N/A");
            row.put("productType", p.getProductType() != null ? p.getProductType().name() : "N/A");
            row.put("sellingPrice", p.getSellingPrice());
            row.put("reorderLevel", p.getReorderLevel());
            row.put("currentStock", bi.getQuantityOnHand());
            row.put("availableStock", bi.getQuantityAvailable());
            row.put("activeBatches", batchCount);
            row.put("nearestExpiry", nearestExpiry.orElse(null));
            row.put("stockStatus",
                    bi.getQuantityAvailable() <= 0 ? "OUT_OF_STOCK" :
                            bi.getQuantityAvailable() < bi.getReorderLevel() ? "LOW_STOCK" : "IN_STOCK");
            row.put("isActive", p.getIsActive());
            return row;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getProductActivitySummary(Long branchId) {
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        long active = inventories.stream().filter(bi -> Boolean.TRUE.equals(bi.getProduct().getIsActive())).count();
        long inactive = inventories.size() - active;
        long outOfStock = inventories.stream().filter(bi -> bi.getQuantityAvailable() <= 0).count();
        long lowStock = inventories.stream()
                .filter(bi -> bi.getQuantityAvailable() > 0 && bi.getQuantityAvailable() < bi.getReorderLevel()).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalProducts", inventories.size());
        summary.put("activeProducts", active);
        summary.put("inactiveProducts", inactive);
        summary.put("outOfStockProducts", outOfStock);
        summary.put("lowStockProducts", lowStock);
        summary.put("inStockProducts", active - lowStock - outOfStock);
        return summary;
    }
}