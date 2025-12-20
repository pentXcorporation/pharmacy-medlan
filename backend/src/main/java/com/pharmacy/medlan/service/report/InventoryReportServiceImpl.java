package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryReportServiceImpl implements InventoryReportService {

    private final BranchInventoryRepository branchInventoryRepository;
    private final InventoryBatchRepository inventoryBatchRepository;

    @Override
    public BigDecimal getTotalStockValue(Long branchId) {
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        BigDecimal totalValue = BigDecimal.ZERO;
        
        for (BranchInventory bi : inventories) {
            List<InventoryBatch> batches = inventoryBatchRepository.findByProductIdAndBranchId(
                    bi.getProduct().getId(), branchId);
            for (InventoryBatch batch : batches) {
                if (batch.getQuantityAvailable() > 0) {
                    totalValue = totalValue.add(
                            batch.getPurchasePrice().multiply(BigDecimal.valueOf(batch.getQuantityAvailable())));
                }
            }
        }
        return totalValue;
    }

    @Override
    public Map<String, BigDecimal> getStockValueByCategory(Long branchId) {
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        Map<String, BigDecimal> categoryValues = new HashMap<>();
        
        for (BranchInventory bi : inventories) {
            String categoryName = bi.getProduct().getCategory() != null ?
                    bi.getProduct().getCategory().getCategoryName() : "Uncategorized";
            
            List<InventoryBatch> batches = inventoryBatchRepository.findByProductIdAndBranchId(
                    bi.getProduct().getId(), branchId);
            BigDecimal itemValue = batches.stream()
                    .filter(b -> b.getQuantityAvailable() > 0)
                    .map(b -> b.getPurchasePrice().multiply(BigDecimal.valueOf(b.getQuantityAvailable())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            categoryValues.merge(categoryName, itemValue, BigDecimal::add);
        }
        return categoryValues;
    }

    @Override
    public List<Map<String, Object>> getStockMovementReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        // Would need to query InventoryTransaction or bin card for movements
        // Placeholder implementation
        return List.of();
    }

    @Override
    public List<Map<String, Object>> getLowStockReport(Long branchId) {
        List<BranchInventory> lowStockItems = branchInventoryRepository.findLowStockByBranch(branchId);
        return lowStockItems.stream()
                .map(bi -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", bi.getProduct().getId());
                    item.put("productName", bi.getProduct().getProductName());
                    item.put("productCode", bi.getProduct().getProductCode());
                    item.put("currentStock", bi.getQuantityAvailable());
                    item.put("reorderLevel", bi.getReorderLevel());
                    item.put("minimumStock", bi.getMinimumStock());
                    item.put("shortfall", bi.getReorderLevel() - bi.getQuantityAvailable());
                    return item;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getExpiringStockReport(Long branchId, int daysToExpiry) {
        LocalDate alertDate = LocalDate.now().plusDays(daysToExpiry);
        List<InventoryBatch> expiringBatches = inventoryBatchRepository.findExpiringBatchesForAlert(branchId, alertDate);
        
        return expiringBatches.stream()
                .map(batch -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", batch.getProduct().getId());
                    item.put("productName", batch.getProduct().getProductName());
                    item.put("batchNumber", batch.getBatchNumber());
                    item.put("quantity", batch.getQuantityAvailable());
                    item.put("expiryDate", batch.getExpiryDate());
                    item.put("daysToExpiry", java.time.temporal.ChronoUnit.DAYS.between(
                            LocalDate.now(), batch.getExpiryDate()));
                    item.put("value", batch.getPurchasePrice().multiply(
                            BigDecimal.valueOf(batch.getQuantityAvailable())));
                    return item;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getExpiredStockReport(Long branchId) {
        List<InventoryBatch> expiredBatches = inventoryBatchRepository.findExpiredBatches(LocalDate.now());
        
        return expiredBatches.stream()
                .filter(batch -> branchId == null || batch.getBranch().getId().equals(branchId))
                .map(batch -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", batch.getProduct().getId());
                    item.put("productName", batch.getProduct().getProductName());
                    item.put("batchNumber", batch.getBatchNumber());
                    item.put("quantity", batch.getQuantityAvailable());
                    item.put("expiryDate", batch.getExpiryDate());
                    item.put("value", batch.getPurchasePrice().multiply(
                            BigDecimal.valueOf(batch.getQuantityAvailable())));
                    return item;
                })
                .toList();
    }

    @Override
    public Map<String, Object> getStockTurnoverReport(Long branchId, LocalDate startDate, LocalDate endDate) {
        // Would need sales history analysis - placeholder
        Map<String, Object> report = new HashMap<>();
        report.put("period", Map.of("startDate", startDate, "endDate", endDate));
        report.put("message", "Stock turnover report requires sales history integration");
        return report;
    }

    @Override
    public List<Map<String, Object>> getDeadStockReport(Long branchId, int daysSinceLastSale) {
        // Would need to track last sale date - placeholder
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        return inventories.stream()
                .filter(bi -> bi.getQuantityOnHand() > 0)
                .map(bi -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", bi.getProduct().getId());
                    item.put("productName", bi.getProduct().getProductName());
                    item.put("quantity", bi.getQuantityOnHand());
                    item.put("daysSinceLastSale", daysSinceLastSale); // placeholder
                    return item;
                })
                .limit(20) // Limit results
                .toList();
    }

    @Override
    public Map<String, Object> getInventorySummary(Long branchId) {
        List<BranchInventory> inventories = branchInventoryRepository.findByBranchId(branchId);
        
        int totalProducts = inventories.size();
        int totalQuantity = inventories.stream()
                .mapToInt(BranchInventory::getQuantityOnHand)
                .sum();
        
        int lowStockCount = (int) inventories.stream()
                .filter(bi -> bi.getQuantityAvailable() < bi.getReorderLevel() && bi.getQuantityAvailable() > 0)
                .count();
        
        int outOfStockCount = (int) inventories.stream()
                .filter(bi -> bi.getQuantityAvailable() <= 0)
                .count();
        
        LocalDate alertDate = LocalDate.now().plusDays(30);
        int expiringCount = inventoryBatchRepository.findExpiringBatchesForAlert(branchId, alertDate).size();
        int expiredCount = inventoryBatchRepository.findExpiredBatches(LocalDate.now()).stream()
                .filter(b -> branchId == null || b.getBranch().getId().equals(branchId))
                .toList().size();
        
        BigDecimal totalValue = getTotalStockValue(branchId);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", totalProducts);
        summary.put("totalQuantity", totalQuantity);
        summary.put("totalValue", totalValue);
        summary.put("lowStockCount", lowStockCount);
        summary.put("outOfStockCount", outOfStockCount);
        summary.put("expiringCount", expiringCount);
        summary.put("expiredCount", expiredCount);
        
        return summary;
    }
}
