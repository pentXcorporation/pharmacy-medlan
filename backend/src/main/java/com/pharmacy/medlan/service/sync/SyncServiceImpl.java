package com.pharmacy.medlan.service.sync;

import com.pharmacy.medlan.enums.SyncStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.audit.SyncLog;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.repository.audit.SyncLogRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SyncServiceImpl implements SyncService {

    private final SyncLogRepository syncLogRepository;
    private final BranchRepository branchRepository;

    @Override
    public SyncLog startSync(String syncType, Long branchId) {
        log.info("Starting sync: type={}, branchId={}", syncType, branchId);

        Branch branch = branchId != null ? branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId)) : null;

        SyncLog syncLog = SyncLog.builder()
                .syncType(syncType)
                .branch(branch)
                .startedAt(LocalDateTime.now())
                .status(SyncStatus.IN_PROGRESS)
                .recordsProcessed(0)
                .recordsFailed(0)
                .build();

        return syncLogRepository.save(syncLog);
    }

    @Override
    public SyncLog completeSync(Long syncLogId, int recordsProcessed, int recordsFailed) {
        SyncLog syncLog = syncLogRepository.findById(syncLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Sync log not found with id: " + syncLogId));

        syncLog.setStatus(SyncStatus.COMPLETED);
        syncLog.setCompletedAt(LocalDateTime.now());
        syncLog.setRecordsProcessed(recordsProcessed);
        syncLog.setRecordsFailed(recordsFailed);

        log.info("Sync completed: {} processed, {} failed", recordsProcessed, recordsFailed);
        return syncLogRepository.save(syncLog);
    }

    @Override
    public SyncLog failSync(Long syncLogId, String errorMessage) {
        SyncLog syncLog = syncLogRepository.findById(syncLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Sync log not found with id: " + syncLogId));

        syncLog.setStatus(SyncStatus.FAILED);
        syncLog.setCompletedAt(LocalDateTime.now());
        syncLog.setErrorMessage(errorMessage);

        log.error("Sync failed: {}", errorMessage);
        return syncLogRepository.save(syncLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SyncLog> getSyncLogsByBranch(Long branchId) {
        return syncLogRepository.findByBranchId(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SyncLog> getSyncLogsByType(String syncType) {
        return syncLogRepository.findBySyncType(syncType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SyncLog> getSyncLogsByStatus(SyncStatus status) {
        return syncLogRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public SyncLog getLatestSync(String syncType) {
        return syncLogRepository.findBySyncType(syncType)
                .stream()
                .reduce((first, second) -> second)
                .orElse(null);
    }
}
