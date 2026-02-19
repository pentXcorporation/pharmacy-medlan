package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.enums.SyncStatus;
import com.pharmacy.medlan.model.audit.SyncLog;
import com.pharmacy.medlan.service.sync.SyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@Tag(name = "Sync", description = "Data synchronization APIs")
public class SyncController {

    private final SyncService syncService;

    @PostMapping("/start")
    @Operation(summary = "Start sync", description = "Start a new synchronization process")
    public ResponseEntity<ApiResponse<SyncLog>> startSync(
            @RequestParam String syncType,
            @RequestParam Long branchId) {
        SyncLog syncLog = syncService.startSync(syncType, branchId);
        return ResponseEntity.ok(ApiResponse.success("Sync started", syncLog));
    }

    @PutMapping("/{syncLogId}/complete")
    @Operation(summary = "Complete sync")
    public ResponseEntity<ApiResponse<SyncLog>> completeSync(
            @PathVariable Long syncLogId,
            @RequestParam int recordsProcessed,
            @RequestParam(defaultValue = "0") int recordsFailed) {
        SyncLog syncLog = syncService.completeSync(syncLogId, recordsProcessed, recordsFailed);
        return ResponseEntity.ok(ApiResponse.success("Sync completed", syncLog));
    }

    @PutMapping("/{syncLogId}/fail")
    @Operation(summary = "Mark sync as failed")
    public ResponseEntity<ApiResponse<SyncLog>> failSync(
            @PathVariable Long syncLogId,
            @RequestParam String errorMessage) {
        SyncLog syncLog = syncService.failSync(syncLogId, errorMessage);
        return ResponseEntity.ok(ApiResponse.success("Sync marked as failed", syncLog));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get sync logs by branch")
    public ResponseEntity<ApiResponse<List<SyncLog>>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getSyncLogsByBranch(branchId)));
    }

    @GetMapping("/type/{syncType}")
    @Operation(summary = "Get sync logs by type")
    public ResponseEntity<ApiResponse<List<SyncLog>>> getByType(@PathVariable String syncType) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getSyncLogsByType(syncType)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get sync logs by status")
    public ResponseEntity<ApiResponse<List<SyncLog>>> getByStatus(@PathVariable SyncStatus status) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getSyncLogsByStatus(status)));
    }

    @GetMapping("/latest/{syncType}")
    @Operation(summary = "Get latest sync log by type")
    public ResponseEntity<ApiResponse<SyncLog>> getLatest(@PathVariable String syncType) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getLatestSync(syncType)));
    }
}
