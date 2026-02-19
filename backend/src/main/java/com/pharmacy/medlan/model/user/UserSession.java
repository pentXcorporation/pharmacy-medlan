package com.pharmacy.medlan.model.user;

import com.pharmacy.medlan.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions", indexes = {
        @Index(name = "idx_session_token", columnList = "session_token"),
        @Index(name = "idx_session_user", columnList = "user_id"),
        @Index(name = "idx_session_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "sessionToken"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class UserSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "session_token", nullable = false, unique = true, length = 500)
    @NotBlank(message = "Session token is required")
    private String sessionToken;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "login_time", nullable = false)
    @NotNull
    private LocalDateTime loginTime;

    @Column(name = "last_activity_time", nullable = false)
    @NotNull
    private LocalDateTime lastActivityTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "expires_at", nullable = false)
    @NotNull
    private LocalDateTime expiresAt;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void updateActivity() {
        this.lastActivityTime = LocalDateTime.now();
    }

    public void invalidate() {
        this.isActive = false;
        this.logoutTime = LocalDateTime.now();
    }
}