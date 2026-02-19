package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.service.user.UserSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for cleaning up expired/stale user sessions.
 * Runs periodically to remove inactive sessions from the database.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class SessionCleanupScheduler {

    private final UserSessionService userSessionService;

    /**
     * Clean up expired sessions every 30 minutes
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes in milliseconds
    public void cleanupExpiredSessions() {
        log.debug("Running scheduled session cleanup...");
        try {
            userSessionService.cleanupExpiredSessions();
            log.debug("Session cleanup completed successfully");
        } catch (Exception e) {
            log.error("Error during scheduled session cleanup", e);
        }
    }
}