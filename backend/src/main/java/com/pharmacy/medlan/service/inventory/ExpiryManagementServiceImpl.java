package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.report.ExpiryAlert;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.report.ExpiryAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ExpiryManagementServiceImpl implements ExpiryManagementService {

    private final InventoryBatchRepository inventoryBatchRepository;
    private final ExpiryAlertRepository expiryAlertRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InventoryBatch> getExpiringBatches(Long branchId, int daysThreshold) {
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.plusDays(daysThreshold);
        return inventoryBatchRepository.findByExpiryDateBetweenAndIsActiveAndIsExpired(now, threshold, true, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryBatch> getExpiredBatches(Long branchId) {
        return inventoryBatchRepository.findByExpiryDateBeforeAndIsExpiredFalse(LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryBatch> getBatchesExpiringBetween(LocalDate startDate, LocalDate endDate) {
        return inventoryBatchRepository.findByExpiryDateBetweenAndIsActiveAndIsExpired(startDate, endDate, true, false);
    }

    @Override
    public List<ExpiryAlert> generateExpiryAlerts(Long branchId, int daysThreshold) {
        log.info("Generating expiry alerts for branch {} with threshold {} days", branchId, daysThreshold);
        List<InventoryBatch> expiringBatches = getExpiringBatches(branchId, daysThreshold);
        List<ExpiryAlert> alerts = new ArrayList<>();

        for (InventoryBatch batch : expiringBatches) {
            long daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), batch.getExpiryDate());
            AlertLevel alertLevel = determineAlertLevel(daysToExpiry);

            ExpiryAlert alert = ExpiryAlert.builder()
                    .product(batch.getProduct())
                    .inventoryBatch(batch)
                    .branch(batch.getBranch())
                    .batchNumber(batch.getBatchNumber())
                    .expiryDate(batch.getExpiryDate())
                    .daysToExpiry((int) daysToExpiry)
                    .quantityAvailable(batch.getQuantityAvailable())
                    .batchValue(batch.getSellingPrice().multiply(BigDecimal.valueOf(batch.getQuantityAvailable())))
                    .alertLevel(alertLevel)
                    .alertGeneratedAt(LocalDateTime.now())
                    .isAcknowledged(false)
                    .build();

            alerts.add(expiryAlertRepository.save(alert));
        }

        log.info("Generated {} expiry alerts", alerts.size());
        return alerts;
    }

    @Override
    public void acknowledgeExpiryAlert(Long alertId) {
        ExpiryAlert alert = expiryAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Expiry alert not found with id: " + alertId));
        alert.setIsAcknowledged(true);
        alert.setAcknowledgedAt(LocalDateTime.now());
        expiryAlertRepository.save(alert);
    }

    @Override
    public void processExpiredBatches() {
        log.info("Processing expired batches");
        List<InventoryBatch> expiredBatches = inventoryBatchRepository.findByExpiryDateBeforeAndIsExpiredFalse(LocalDate.now());
        for (InventoryBatch batch : expiredBatches) {
            batch.setIsExpired(true);
            batch.setIsActive(false);
            inventoryBatchRepository.save(batch);
        }
        log.info("Processed {} expired batches", expiredBatches.size());
    }

    @Override
    public void markBatchAsExpired(Long batchId) {
        InventoryBatch batch = inventoryBatchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found with id: " + batchId));
        batch.setIsExpired(true);
        batch.setIsActive(false);
        inventoryBatchRepository.save(batch);
    }

    @Override
    @Transactional(readOnly = true)
    public int getExpiringBatchCount(Long branchId, int daysThreshold) {
        return getExpiringBatches(branchId, daysThreshold).size();
    }

    @Override
    @Transactional(readOnly = true)
    public int getExpiredBatchCount(Long branchId) {
        return getExpiredBatches(branchId).size();
    }

    private AlertLevel determineAlertLevel(long daysToExpiry) {
        if (daysToExpiry <= 0) return AlertLevel.EXPIRED;
        if (daysToExpiry <= 7) return AlertLevel.CRITICAL;
        if (daysToExpiry <= 30) return AlertLevel.URGENT;
        if (daysToExpiry <= 60) return AlertLevel.WARNING;
        if (daysToExpiry <= 90) return AlertLevel.LOW;
        return AlertLevel.INFO;
    }
}
