package com.pharmacy.medlan.event.publisher;

import com.pharmacy.medlan.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    /**
     * Publish a notification event to be picked up by listeners
     */
    public void publishNotification(String title, String message, NotificationType type,
                                     Long branchId, Long userId) {
        log.debug("Publishing notification event: type={}, title={}, branch={}, user={}",
                type, title, branchId, userId);
        eventPublisher.publishEvent(
                new NotificationEvent(this, title, message, type, branchId, userId));
    }

    /**
     * Publish a broadcast notification (all users in a branch)
     */
    public void publishBroadcastNotification(String title, String message,
                                              NotificationType type, Long branchId) {
        log.debug("Publishing broadcast notification: type={}, title={}, branch={}",
                type, title, branchId);
        eventPublisher.publishEvent(
                new NotificationEvent(this, title, message, type, branchId, null));
    }

    // --- Inner event class ---

    public record NotificationEvent(Object source, String title, String message,
                                     NotificationType type, Long branchId, Long userId) {
    }
}
