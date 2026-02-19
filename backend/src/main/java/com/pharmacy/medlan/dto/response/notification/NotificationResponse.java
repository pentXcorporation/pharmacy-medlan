package com.pharmacy.medlan.dto.response.notification;

import com.pharmacy.medlan.enums.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private String userName;
    private NotificationType type;
    private String title;
    private String message;
    private Long referenceId;
    private String referenceType;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String priority;
    private String actionUrl;
    private LocalDateTime createdAt;
}