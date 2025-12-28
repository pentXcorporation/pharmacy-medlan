package com.pharmacy.medlan.service.notification;

import com.pharmacy.medlan.dto.request.NotificationRequest;
import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.notification.Notification;

import java.util.List;

/**
 * Service interface for handling notifications
 */
public interface NotificationService {
    
    /**
     * Send a notification to a user
     */
    Notification sendNotification(NotificationRequest request);
    
    /**
     * Send notification to multiple users
     */
    List<Notification> sendBulkNotifications(NotificationRequest request, List<Long> userIds);
    
    /**
     * Send notification to all users in a branch
     */
    List<Notification> sendToBranch(Long branchId, NotificationRequest request);
    
    /**
     * Send notification to users with specific role in a branch
     */
    List<Notification> sendToRole(Long branchId, String role, NotificationRequest request);
    
    /**
     * Get all notifications for a user
     */
    List<Notification> getUserNotifications(Long userId);
    
    /**
     * Get unread notifications for a user
     */
    List<Notification> getUnreadNotifications(Long userId);
    
    /**
     * Get unread notification count
     */
    int getUnreadCount(Long userId);
    
    /**
     * Mark notification as read
     */
    void markAsRead(Long notificationId);
    
    /**
     * Mark all notifications as read for a user
     */
    void markAllAsRead(Long userId);
    
    /**
     * Delete a notification
     */
    void deleteNotification(Long notificationId);
    
    /**
     * Delete all notifications for a user
     */
    void deleteAllNotifications(Long userId);
    
    /**
     * Send system alert notification
     */
    void sendSystemAlert(String title, String message, NotificationType type, Long branchId);
    
    /**
     * Send low stock alert
     */
    void sendLowStockAlert(Long productId, Long branchId, int currentStock, int reorderLevel);
    
    /**
     * Send expiry alert
     */
    void sendExpiryAlert(Long batchId, Long branchId, int daysToExpiry);
    
    /**
     * Send payment reminder
     */
    void sendPaymentReminder(Long invoiceId, Long customerId);
    
    /**
     * Send email notification
     */
    void sendEmailNotification(String to, String subject, String body);
    
    /**
     * Send SMS notification (if configured)
     */
    void sendSmsNotification(String phoneNumber, String message);
}
