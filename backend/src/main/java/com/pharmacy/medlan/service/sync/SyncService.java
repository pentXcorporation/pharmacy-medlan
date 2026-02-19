package com.pharmacy.medlan.service.sync;

import com.pharmacy.medlan.enums.SyncStatus;
import com.pharmacy.medlan.model.audit.SyncLog;

import java.util.List;

public interface SyncService {

    SyncLog startSync(String syncType, Long branchId);

    SyncLog completeSync(Long syncLogId, int recordsProcessed, int recordsFailed);

    SyncLog failSync(Long syncLogId, String errorMessage);

    List<SyncLog> getSyncLogsByBranch(Long branchId);

    List<SyncLog> getSyncLogsByType(String syncType);

    List<SyncLog> getSyncLogsByStatus(SyncStatus status);

    SyncLog getLatestSync(String syncType);
}
