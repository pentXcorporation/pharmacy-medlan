package com.pharmacy.medlan.websocket;

import com.pharmacy.medlan.dto.response.notification.NotificationResponse;
import com.pharmacy.medlan.event.publisher.NotificationEventPublisher.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * WebSocket handler for pushing real-time notifications to clients.
 * Listens for NotificationEvents and broadcasts via WebSocket.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationWebSocketHandler {

    private final WebSocketHandler webSocketHandler;

    /**
     * Send a notification to all users in a branch
     */
    public void sendNotificationToBranch(Long branchId, NotificationResponse notification) {
        log.debug("Sending notification to branch {}: {}", branchId, notification.getTitle());
        webSocketHandler.sendToBranch(branchId, "notifications", notification);
    }

    /**
     * Send a notification to a specific user
     */
    public void sendNotificationToUser(String username, NotificationResponse notification) {
        log.debug("Sending notification to user {}: {}", username, notification.getTitle());
        webSocketHandler.sendToUser(username, "notifications", notification);
    }

    /**
     * Broadcast a notification to all connected clients
     */
    public void broadcastNotification(NotificationResponse notification) {
        log.debug("Broadcasting notification: {}", notification.getTitle());
        webSocketHandler.sendToTopic("notifications", notification);
    }

    /**
     * Listen for notification events from the event system
     */
    @Async
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        log.debug("Handling notification event: type={}, title={}", event.type(), event.title());

        NotificationResponse response = NotificationResponse.builder()
                .title(event.title())
                .message(event.message())
                .type(event.type())
                .build();

        if (event.branchId() != null) {
            sendNotificationToBranch(event.branchId(), response);
        } else {
            broadcastNotification(response);
        }
    }
}
