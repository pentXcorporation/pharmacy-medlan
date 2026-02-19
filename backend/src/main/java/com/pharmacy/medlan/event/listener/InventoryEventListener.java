package com.pharmacy.medlan.event.listener;

import com.pharmacy.medlan.event.publisher.InventoryEventPublisher.LowStockAlertEvent;
import com.pharmacy.medlan.event.publisher.InventoryEventPublisher.StockLevelChangedEvent;
import com.pharmacy.medlan.event.publisher.InventoryEventPublisher.StockTransferCompletedEvent;
import com.pharmacy.medlan.event.publisher.NotificationEventPublisher;
import com.pharmacy.medlan.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventListener {

    private final NotificationEventPublisher notificationEventPublisher;

    @Async
    @EventListener
    public void handleStockLevelChanged(StockLevelChangedEvent event) {
        log.debug("Handling stock level changed: product={}, branch={}, {} -> {}",
                event.productId(), event.branchId(), event.previousQuantity(), event.newQuantity());
        // Additional processing such as bin card recording, analytics, etc.
    }

    @Async
    @EventListener
    public void handleLowStockAlert(LowStockAlertEvent event) {
        log.info("Handling low stock alert: product={}, branch={}, current={}, reorder={}",
                event.productId(), event.branchId(), event.currentQuantity(), event.reorderLevel());

        notificationEventPublisher.publishBroadcastNotification(
                "Low Stock Alert",
                String.format("Product ID %d in branch %d has reached low stock level (%d units remaining, reorder at %d)",
                        event.productId(), event.branchId(), event.currentQuantity(), event.reorderLevel()),
                NotificationType.LOW_STOCK,
                event.branchId()
        );
    }

    @Async
    @EventListener
    public void handleStockTransferCompleted(StockTransferCompletedEvent event) {
        log.info("Handling stock transfer completed: transfer={}, from={}, to={}",
                event.transferId(), event.fromBranchId(), event.toBranchId());

        notificationEventPublisher.publishBroadcastNotification(
                "Stock Transfer Completed",
                String.format("Stock transfer #%d from branch %d to branch %d has been completed",
                        event.transferId(), event.fromBranchId(), event.toBranchId()),
                NotificationType.SYSTEM,
                event.toBranchId()
        );
    }
}
