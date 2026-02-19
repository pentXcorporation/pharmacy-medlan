package com.pharmacy.medlan.model.notification;

import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user", columnList = "user_id"),
        @Index(name = "idx_notification_read", columnList = "is_read"),
        @Index(name = "idx_notification_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Notification extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @Column(name = "title", nullable = false, length = 200)
    @NotBlank(message = "Title is required")
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Message is required")
    private String message;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type", length = 100)
    private String referenceType;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "priority", length = 20)
    @Builder.Default
    private String priority = "NORMAL";

    @Column(name = "action_url", length = 500)
    private String actionUrl;

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    public boolean isBroadcast() {
        return user == null;
    }
}