package com.pharmacy.medlan.service.audit;

import com.pharmacy.medlan.model.audit.AuditLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditService {

    void logAction(String action, String entityType, Long entityId, String oldValue, String newValue, String description);

    List<AuditLog> getAuditLogsByUser(Long userId);

    List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId);

    List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<AuditLog> getAuditLogsByUserAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    List<AuditLog> getAuditLogsByAction(String action);
}
