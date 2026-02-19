package com.pharmacy.medlan.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Base WebSocket handler providing common messaging functionality.
 * Uses STOMP over SockJS as configured in WebSocketConfig.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send a message to a specific topic
     */
    public void sendToTopic(String topic, Object payload) {
        log.debug("Sending message to topic: /topic/{}", topic);
        messagingTemplate.convertAndSend("/topic/" + topic, payload);
    }

    /**
     * Send a message to a specific user's queue
     */
    public void sendToUser(String username, String destination, Object payload) {
        log.debug("Sending message to user: {} at /queue/{}", username, destination);
        messagingTemplate.convertAndSendToUser(username, "/queue/" + destination, payload);
    }

    /**
     * Send a message to a branch-specific topic
     */
    public void sendToBranch(Long branchId, String event, Object payload) {
        String topic = "branch." + branchId + "." + event;
        log.debug("Sending message to branch topic: /topic/{}", topic);
        messagingTemplate.convertAndSend("/topic/" + topic, payload);
    }
}
