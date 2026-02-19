package com.pharmacy.medlan.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * WebSocket handler for pushing real-time sync status updates to clients.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SyncWebSocketHandler {

    private final WebSocketHandler webSocketHandler;

    /**
     * Notify a branch that sync has started
     */
    public void sendSyncStarted(Long branchId, String syncType) {
        log.debug("Sending sync started to branch {}: type={}", branchId, syncType);
        webSocketHandler.sendToBranch(branchId, "sync", Map.of(
                "status", "STARTED",
                "syncType", syncType,
                "branchId", branchId
        ));
    }

    /**
     * Notify a branch of sync progress
     */
    public void sendSyncProgress(Long branchId, String syncType, int recordsProcessed, int totalRecords) {
        log.debug("Sending sync progress to branch {}: type={}, {}/{}",
                branchId, syncType, recordsProcessed, totalRecords);
        webSocketHandler.sendToBranch(branchId, "sync", Map.of(
                "status", "IN_PROGRESS",
                "syncType", syncType,
                "branchId", branchId,
                "recordsProcessed", recordsProcessed,
                "totalRecords", totalRecords
        ));
    }

    /**
     * Notify a branch that sync has completed
     */
    public void sendSyncCompleted(Long branchId, String syncType, int recordsProcessed, int recordsFailed) {
        log.info("Sending sync completed to branch {}: type={}, processed={}, failed={}",
                branchId, syncType, recordsProcessed, recordsFailed);
        webSocketHandler.sendToBranch(branchId, "sync", Map.of(
                "status", "COMPLETED",
                "syncType", syncType,
                "branchId", branchId,
                "recordsProcessed", recordsProcessed,
                "recordsFailed", recordsFailed
        ));
    }

    /**
     * Notify a branch that sync has failed
     */
    public void sendSyncFailed(Long branchId, String syncType, String errorMessage) {
        log.error("Sending sync failed to branch {}: type={}, error={}", branchId, syncType, errorMessage);
        webSocketHandler.sendToBranch(branchId, "sync", Map.of(
                "status", "FAILED",
                "syncType", syncType,
                "branchId", branchId,
                "errorMessage", errorMessage
        ));
    }
}
