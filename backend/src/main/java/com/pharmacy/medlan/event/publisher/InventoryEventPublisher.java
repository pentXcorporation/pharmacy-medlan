package com.pharmacy.medlan.event.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    /**
     * Publish event when stock level changes
     */
    public void publishStockLevelChanged(Long productId, Long branchId, int previousQty, int newQty) {
        log.debug("Publishing stock level changed event for product {} in branch {}: {} -> {}",
                productId, branchId, previousQty, newQty);
        eventPublisher.publishEvent(new StockLevelChangedEvent(this, productId, branchId, previousQty, newQty));
    }

    /**
     * Publish event when a product reaches low stock threshold
     */
    public void publishLowStockAlert(Long productId, Long branchId, int currentQty, int reorderLevel) {
        log.info("Publishing low stock alert for product {} in branch {}: current={}, reorder={}",
                productId, branchId, currentQty, reorderLevel);
        eventPublisher.publishEvent(new LowStockAlertEvent(this, productId, branchId, currentQty, reorderLevel));
    }

    /**
     * Publish event when a stock transfer is completed
     */
    public void publishStockTransferCompleted(Long transferId, Long fromBranchId, Long toBranchId) {
        log.info("Publishing stock transfer completed event: transfer={}, from={}, to={}",
                transferId, fromBranchId, toBranchId);
        eventPublisher.publishEvent(new StockTransferCompletedEvent(this, transferId, fromBranchId, toBranchId));
    }

    // --- Inner event classes ---

    public record StockLevelChangedEvent(Object source, Long productId, Long branchId,
                                          int previousQuantity, int newQuantity) {
    }

    public record LowStockAlertEvent(Object source, Long productId, Long branchId,
                                      int currentQuantity, int reorderLevel) {
    }

    public record StockTransferCompletedEvent(Object source, Long transferId,
                                               Long fromBranchId, Long toBranchId) {
    }
}
