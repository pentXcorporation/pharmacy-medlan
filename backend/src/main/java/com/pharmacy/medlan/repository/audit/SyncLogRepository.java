package com.pharmacy.medlan.repository.audit;

import com.pharmacy.medlan.model.audit.SyncLog;
import com.pharmacy.medlan.enums.SyncStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {
    List<SyncLog> findBySyncType(String syncType);
    List<SyncLog> findByBranchId(Long branchId);
    List<SyncLog> findByStatus(SyncStatus status);
    List<SyncLog> findByStartedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<SyncLog> findBySyncTypeAndStatus(String syncType, SyncStatus status);
}