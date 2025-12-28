package com.pharmacy.medlan.dto.request;

import com.pharmacy.medlan.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating notifications
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    /**
     * User ID to send notification to
     */
    private Long userId;
    
    /**
     * Notification title
     */
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    
    /**
     * Notification message body
     */
    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;
    
    /**
     * Type of notification
     */
    @NotNull(message = "Notification type is required")
    private NotificationType type;
    
    /**
     * Priority level
     */
    @Builder.Default
    private Priority priority = Priority.NORMAL;
    
    /**
     * Optional reference ID (e.g., product ID, invoice ID)
     */
    private Long referenceId;
    
    /**
     * Type of reference (e.g., PRODUCT, INVOICE, BATCH)
     */
    private String referenceType;
    
    /**
     * Action URL to redirect when notification is clicked
     */
    private String actionUrl;
    
    /**
     * Whether to also send an email notification
     */
    @Builder.Default
    private boolean sendEmail = false;
    
    /**
     * Whether to also send SMS notification
     */
    @Builder.Default
    private boolean sendSms = false;
    
    /**
     * Custom data/metadata in JSON format
     */
    private String metadata;
    
    /**
     * Priority levels for notifications
     */
    public enum Priority {
        LOW,
        NORMAL,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
