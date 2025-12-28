package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.validation.annotation.RateLimit;
import com.pharmacy.medlan.dto.request.NotificationRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.service.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for notification management
 */
@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all notifications for current user")
    @RateLimit(key = "default", capacity = 100, refillTokens = 100, refillSeconds = 60)
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // In real implementation, get user ID from UserDetails
        // For now, using a placeholder - this should be enhanced
        Long userId = extractUserId(userDetails);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications for current user")
    @RateLimit(key = "default", capacity = 100, refillTokens = 100, refillSeconds = 60)
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", notifications));
    }

    @GetMapping("/count")
    @Operation(summary = "Get unread notification count")
    @RateLimit(key = "default", capacity = 100, refillTokens = 100, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        int count = notificationService.getUnreadCount(userId);
        
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", 
                Map.of("unreadCount", count)));
    }

    @PostMapping
    @Operation(summary = "Send a notification")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @RateLimit(key = "default", capacity = 50, refillTokens = 50, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Notification>> sendNotification(
            @Valid @RequestBody NotificationRequest request) {
        
        log.info("Sending notification to user: {}", request.getUserId());
        Notification notification = notificationService.sendNotification(request);
        
        return ResponseEntity.ok(ApiResponse.success("Notification sent successfully", notification));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Send notifications to multiple users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @RateLimit(key = "bulk", capacity = 10, refillTokens = 10, refillSeconds = 60)
    public ResponseEntity<ApiResponse<List<Notification>>> sendBulkNotifications(
            @Valid @RequestBody NotificationRequest request,
            @RequestParam List<Long> userIds) {
        
        log.info("Sending bulk notifications to {} users", userIds.size());
        List<Notification> notifications = notificationService.sendBulkNotifications(request, userIds);
        
        return ResponseEntity.ok(ApiResponse.success("Bulk notifications sent successfully", notifications));
    }

    @PostMapping("/branch/{branchId}")
    @Operation(summary = "Send notification to all users in a branch")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @RateLimit(key = "bulk", capacity = 10, refillTokens = 10, refillSeconds = 60)
    public ResponseEntity<ApiResponse<List<Notification>>> sendToBranch(
            @PathVariable Long branchId,
            @Valid @RequestBody NotificationRequest request) {
        
        log.info("Sending notification to all users in branch: {}", branchId);
        List<Notification> notifications = notificationService.sendToBranch(branchId, request);
        
        return ResponseEntity.ok(ApiResponse.success("Branch notifications sent successfully", notifications));
    }

    @PostMapping("/role")
    @Operation(summary = "Send notification to users with specific role")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @RateLimit(key = "bulk", capacity = 10, refillTokens = 10, refillSeconds = 60)
    public ResponseEntity<ApiResponse<List<Notification>>> sendToRole(
            @RequestParam Long branchId,
            @RequestParam String role,
            @Valid @RequestBody NotificationRequest request) {
        
        log.info("Sending notification to role {} in branch: {}", role, branchId);
        List<Notification> notifications = notificationService.sendToRole(branchId, role, request);
        
        return ResponseEntity.ok(ApiResponse.success("Role notifications sent successfully", notifications));
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark notification as read")
    @RateLimit(key = "default", capacity = 100, refillTokens = 100, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long notificationId) {
        
        log.info("Marking notification {} as read", notificationId);
        notificationService.markAsRead(notificationId);
        
        return ResponseEntity.ok(ApiResponse.<Void>success("Notification marked as read"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    @RateLimit(key = "default", capacity = 50, refillTokens = 50, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        
        return ResponseEntity.ok(ApiResponse.<Void>success("All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete a notification")
    @RateLimit(key = "default", capacity = 50, refillTokens = 50, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long notificationId) {
        
        log.info("Deleting notification: {}", notificationId);
        notificationService.deleteNotification(notificationId);
        
        return ResponseEntity.ok(ApiResponse.<Void>success("Notification deleted"));
    }

    @DeleteMapping("/all")
    @Operation(summary = "Delete all notifications for current user")
    @RateLimit(key = "default", capacity = 10, refillTokens = 10, refillSeconds = 60)
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        log.info("Deleting all notifications for user: {}", userId);
        notificationService.deleteAllNotifications(userId);
        
        return ResponseEntity.ok(ApiResponse.<Void>success("All notifications deleted"));
    }

    /**
     * Extract user ID from UserDetails by querying the repository
     */
    private Long extractUserId(UserDetails userDetails) {
        if (userDetails == null) {
            return 1L; // Default fallback
        }
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        return user != null ? user.getId() : 1L;
    }
}
