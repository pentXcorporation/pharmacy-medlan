package com.pharmacy.medlan.event.listener;

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
public class SyncEventListener {

    private final NotificationEventPublisher notificationEventPublisher;

    @Async
    @EventListener
    public void handleSyncCompleted(SyncCompletedEvent event) {
        log.info("Handling sync completed: type={}, branch={}, processed={}, failed={}",
                event.syncType(), event.branchId(), event.recordsProcessed(), event.recordsFailed());

        String message = String.format("Sync '%s' completed for branch %d: %d processed, %d failed",
                event.syncType(), event.branchId(), event.recordsProcessed(), event.recordsFailed());

        notificationEventPublisher.publishBroadcastNotification(
                "Sync Completed",
                message,
                NotificationType.SYSTEM,
                event.branchId()
        );
    }

    @Async
    @EventListener
    public void handleSyncFailed(SyncFailedEvent event) {
        log.error("Handling sync failed: type={}, branch={}, error={}",
                event.syncType(), event.branchId(), event.errorMessage());

        notificationEventPublisher.publishBroadcastNotification(
                "Sync Failed",
                String.format("Sync '%s' failed for branch %d: %s",
                        event.syncType(), event.branchId(), event.errorMessage()),
                NotificationType.SYSTEM,
                event.branchId()
        );
    }

    // --- Event records ---

    public record SyncCompletedEvent(Object source, String syncType, Long branchId,
                                      int recordsProcessed, int recordsFailed) {
    }

    public record SyncFailedEvent(Object source, String syncType, Long branchId,
                                   String errorMessage) {
    }
}
