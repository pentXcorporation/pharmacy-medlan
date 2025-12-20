package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.pos.Invoice;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.pos.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertServiceImpl implements AlertService {

    private final BranchInventoryRepository branchInventoryRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public List<Map<String, Object>> getLowStockAlerts(Long branchId) {
        List<BranchInventory> lowStock = branchInventoryRepository.findLowStockByBranch(branchId);
        return lowStock.stream()
                .map(bi -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("type", "LOW_STOCK");
                    alert.put("severity", "WARNING");
                    alert.put("productId", bi.getProduct().getId());
                    alert.put("productName", bi.getProduct().getProductName());
                    alert.put("currentStock", bi.getQuantityAvailable());
                    alert.put("minStockLevel", bi.getMinimumStock());
                    alert.put("message", String.format("Low stock for %s: %d units remaining (min: %d)",
                            bi.getProduct().getProductName(), bi.getQuantityAvailable(), bi.getMinimumStock()));
                    return alert;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getOutOfStockAlerts(Long branchId) {
        List<BranchInventory> outOfStock = branchInventoryRepository.findOutOfStockByBranch(branchId);
        return outOfStock.stream()
                .map(bi -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("type", "OUT_OF_STOCK");
                    alert.put("severity", "CRITICAL");
                    alert.put("productId", bi.getProduct().getId());
                    alert.put("productName", bi.getProduct().getProductName());
                    alert.put("message", String.format("Out of stock: %s", bi.getProduct().getProductName()));
                    return alert;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getExpiryAlerts(Long branchId, int daysThreshold) {
        LocalDate alertDate = LocalDate.now().plusDays(daysThreshold);
        List<InventoryBatch> expiringBatches = inventoryBatchRepository.findExpiringBatchesForAlert(branchId, alertDate);

        return expiringBatches.stream()
                .map(batch -> {
                    Map<String, Object> alert = new HashMap<>();
                    long daysToExpiry = java.time.temporal.ChronoUnit.DAYS.between(
                            LocalDate.now(), batch.getExpiryDate());
                    
                    alert.put("type", "EXPIRING_STOCK");
                    alert.put("severity", daysToExpiry <= 7 ? "CRITICAL" : "WARNING");
                    alert.put("productId", batch.getProduct().getId());
                    alert.put("productName", batch.getProduct().getProductName());
                    alert.put("batchNumber", batch.getBatchNumber());
                    alert.put("quantity", batch.getQuantityAvailable());
                    alert.put("expiryDate", batch.getExpiryDate());
                    alert.put("daysToExpiry", daysToExpiry);
                    alert.put("message", String.format("Batch %s of %s expires in %d days",
                            batch.getBatchNumber(), batch.getProduct().getProductName(), daysToExpiry));
                    return alert;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getOverdueInvoiceAlerts(Long branchId) {
        List<Invoice> overdueInvoices = invoiceRepository.findOverdueInvoices(LocalDate.now());
        return overdueInvoices.stream()
                .filter(invoice -> branchId == null || invoice.getBranch().getId().equals(branchId))
                .map(invoice -> {
                    Map<String, Object> alert = new HashMap<>();
                    long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(
                            invoice.getDueDate(), LocalDate.now());
                    
                    alert.put("type", "OVERDUE_INVOICE");
                    alert.put("severity", daysOverdue > 30 ? "CRITICAL" : "WARNING");
                    alert.put("invoiceId", invoice.getId());
                    alert.put("invoiceNumber", invoice.getInvoiceNumber());
                    alert.put("customerId", invoice.getCustomer() != null ? invoice.getCustomer().getId() : null);
                    alert.put("amount", invoice.getBalanceAmount());
                    alert.put("dueDate", invoice.getDueDate());
                    alert.put("daysOverdue", daysOverdue);
                    alert.put("message", String.format("Invoice %s is %d days overdue",
                            invoice.getInvoiceNumber(), daysOverdue));
                    return alert;
                })
                .toList();
    }

    @Override
    public List<Map<String, Object>> getOverduePaymentAlerts(Long branchId) {
        // Placeholder - would need supplier payment tracking
        return List.of();
    }

    @Override
    public List<Map<String, Object>> getPendingApprovalAlerts(Long branchId) {
        // Placeholder - would need approval workflow tracking
        return List.of();
    }

    @Override
    public List<Map<String, Object>> getRecentActivityAlerts(Long branchId, int limit) {
        // Placeholder - would need activity logging
        return List.of();
    }

    @Override
    public Map<String, Object> getAllAlerts(Long branchId) {
        Map<String, Object> allAlerts = new HashMap<>();
        
        allAlerts.put("lowStock", getLowStockAlerts(branchId));
        allAlerts.put("outOfStock", getOutOfStockAlerts(branchId));
        allAlerts.put("expiring", getExpiryAlerts(branchId, 30));
        allAlerts.put("overdueInvoices", getOverdueInvoiceAlerts(branchId));
        allAlerts.put("overduePayments", getOverduePaymentAlerts(branchId));
        allAlerts.put("pendingApprovals", getPendingApprovalAlerts(branchId));
        allAlerts.put("totalCount", getAlertCount(branchId));
        
        return allAlerts;
    }

    @Override
    public int getAlertCount(Long branchId) {
        int count = 0;
        count += getLowStockAlerts(branchId).size();
        count += getOutOfStockAlerts(branchId).size();
        count += getExpiryAlerts(branchId, 30).size();
        count += getOverdueInvoiceAlerts(branchId).size();
        count += getOverduePaymentAlerts(branchId).size();
        count += getPendingApprovalAlerts(branchId).size();
        return count;
    }

    @Override
    @Transactional
    public void acknowledgeAlert(Long alertId) {
        // Placeholder - would need alert persistence model
        log.info("Alert {} acknowledged", alertId);
    }

    @Override
    @Transactional
    public void acknowledgeAllAlerts(Long branchId, String alertType) {
        // Placeholder - would need alert persistence model
        log.info("All alerts of type {} acknowledged for branch {}", alertType, branchId);
    }
}
