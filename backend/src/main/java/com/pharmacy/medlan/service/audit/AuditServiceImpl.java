package com.pharmacy.medlan.service.audit;

import com.pharmacy.medlan.model.audit.AuditLog;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.audit.AuditLogRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void logAction(String action, String entityType, Long entityId, String oldValue, String newValue, String description) {
        log.debug("Logging audit action: {} on {} id: {}", action, entityType, entityId);

        User currentUser = null;
        try {
            currentUser = SecurityUtils.getCurrentUser(userRepository);
        } catch (Exception e) {
            log.debug("No authenticated user for audit log");
        }

        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .description(description)
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "SYSTEM")
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit log recorded: {} on {} id: {}", action, entityType, entityId);
    }

    @Override
    public List<AuditLog> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    @Override
    public List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Override
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate);
    }

    @Override
    public List<AuditLog> getAuditLogsByUserAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByUserAndDateRange(userId, startDate, endDate);
    }

    @Override
    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }
}