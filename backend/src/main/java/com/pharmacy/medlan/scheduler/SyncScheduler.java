package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.service.sync.SyncService;
import com.pharmacy.medlan.websocket.SyncWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for periodic data synchronization between branches.
 * Triggers sync operations and notifies clients via WebSocket.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class SyncScheduler {

    private final SyncService syncService;
    private final SyncWebSocketHandler syncWebSocketHandler;

    /**
     * Run inventory sync every 2 hours
     */
    @Scheduled(cron = "0 0 */2 * * *")
    public void syncInventory() {
        log.info("Running scheduled inventory sync...");
        try {
            var syncLog = syncService.startSync("INVENTORY", null);
            syncWebSocketHandler.sendSyncStarted(0L, "INVENTORY");
            // The actual sync process would populate records
            syncService.completeSync(syncLog.getId(), 0, 0);
            log.info("Scheduled inventory sync completed");
        } catch (Exception e) {
            log.error("Error during scheduled inventory sync", e);
        }
    }

    /**
     * Run product data sync daily at 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void syncProducts() {
        log.info("Running scheduled product sync...");
        try {
            var syncLog = syncService.startSync("PRODUCTS", null);
            syncService.completeSync(syncLog.getId(), 0, 0);
            log.info("Scheduled product sync completed");
        } catch (Exception e) {
            log.error("Error during scheduled product sync", e);
        }
    }
}