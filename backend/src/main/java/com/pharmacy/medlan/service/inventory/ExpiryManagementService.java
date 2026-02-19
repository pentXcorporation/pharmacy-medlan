package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.report.ExpiryAlert;

import java.time.LocalDate;
import java.util.List;

public interface ExpiryManagementService {

    List<InventoryBatch> getExpiringBatches(Long branchId, int daysThreshold);

    List<InventoryBatch> getExpiredBatches(Long branchId);

    List<InventoryBatch> getBatchesExpiringBetween(LocalDate startDate, LocalDate endDate);

    List<ExpiryAlert> generateExpiryAlerts(Long branchId, int daysThreshold);

    void acknowledgeExpiryAlert(Long alertId);

    void processExpiredBatches();

    void markBatchAsExpired(Long batchId);

    int getExpiringBatchCount(Long branchId, int daysThreshold);

    int getExpiredBatchCount(Long branchId);
}
