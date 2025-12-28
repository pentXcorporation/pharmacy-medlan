package com.pharmacy.medlan.service.notification;

import com.pharmacy.medlan.dto.request.NotificationRequest;
import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.model.user.BranchStaff;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.notification.NotificationRepository;
import com.pharmacy.medlan.repository.user.BranchStaffRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of NotificationService for handling all notification operations
 */
@Slf4j
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final BranchStaffRepository branchStaffRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            BranchStaffRepository branchStaffRepository,
            @Autowired(required = false) JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.branchStaffRepository = branchStaffRepository;
        this.mailSender = mailSender;
    }

    @Override
    public Notification sendNotification(NotificationRequest request) {
        log.debug("Sending notification to user: {}", request.getUserId());
        
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + request.getUserId()));
        }
        
        Notification notification = Notification.builder()
                .user(user)
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .priority(request.getPriority() != null ? request.getPriority().name() : "NORMAL")
                .isRead(false)
                .build();
        
        Notification saved = notificationRepository.save(notification);
        log.info("Notification created with ID: {} for user: {}", saved.getId(), request.getUserId());
        
        return saved;
    }

    @Override
    public List<Notification> sendBulkNotifications(NotificationRequest request, List<Long> userIds) {
        log.debug("Sending bulk notifications to {} users", userIds.size());
        
        List<Notification> notifications = new ArrayList<>();
        
        for (Long userId : userIds) {
            try {
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    Notification notification = Notification.builder()
                            .user(user)
                            .type(request.getType())
                            .title(request.getTitle())
                            .message(request.getMessage())
                            .referenceId(request.getReferenceId())
                            .referenceType(request.getReferenceType())
                            .priority(request.getPriority() != null ? request.getPriority().name() : "NORMAL")
                            .isRead(false)
                            .build();
                    notifications.add(notification);
                }
            } catch (Exception e) {
                log.warn("Failed to create notification for user {}: {}", userId, e.getMessage());
            }
        }
        
        List<Notification> saved = notificationRepository.saveAll(notifications);
        log.info("Created {} bulk notifications", saved.size());
        
        return saved;
    }

    @Override
    public List<Notification> sendToBranch(Long branchId, NotificationRequest request) {
        log.debug("Sending notification to all users in branch: {}", branchId);
        
        List<BranchStaff> branchStaff = branchStaffRepository.findByBranchId(branchId);
        List<Long> userIds = branchStaff.stream()
                .map(bs -> bs.getUser().getId())
                .distinct()
                .collect(Collectors.toList());
        
        return sendBulkNotifications(request, userIds);
    }

    @Override
    public List<Notification> sendToRole(Long branchId, String role, NotificationRequest request) {
        log.debug("Sending notification to role {} in branch: {}", role, branchId);
        
        List<BranchStaff> branchStaff = branchStaffRepository.findByBranchId(branchId);
        List<Long> userIds = branchStaff.stream()
                .filter(bs -> bs.getUser().getRole().name().equalsIgnoreCase(role))
                .map(bs -> bs.getUser().getId())
                .distinct()
                .collect(Collectors.toList());
        
        return sendBulkNotifications(request, userIds);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(Long userId) {
        log.debug("Fetching notifications for user: {}", userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        log.debug("Fetching unread notifications for user: {}", userId);
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public int getUnreadCount(Long userId) {
        log.debug("Counting unread notifications for user: {}", userId);
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        log.debug("Marking notification as read: {}", notificationId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found: " + notificationId));
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
        
        log.info("Notification {} marked as read", notificationId);
    }

    @Override
    public void markAllAsRead(Long userId) {
        log.debug("Marking all notifications as read for user: {}", userId);
        notificationRepository.markAllAsReadByUserId(userId, LocalDateTime.now());
        log.info("All notifications marked as read for user: {}", userId);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        log.debug("Deleting notification: {}", notificationId);
        
        if (!notificationRepository.existsById(notificationId)) {
            throw new EntityNotFoundException("Notification not found: " + notificationId);
        }
        
        notificationRepository.deleteById(notificationId);
        log.info("Notification {} deleted", notificationId);
    }

    @Override
    public void deleteAllNotifications(Long userId) {
        log.debug("Deleting all notifications for user: {}", userId);
        notificationRepository.deleteByUserId(userId);
        log.info("All notifications deleted for user: {}", userId);
    }

    @Override
    public void sendSystemAlert(String title, String message, NotificationType type, Long branchId) {
        log.info("Sending system alert: {} to branch: {}", title, branchId);
        
        NotificationRequest request = NotificationRequest.builder()
                .title(title)
                .message(message)
                .type(type)
                .build();
        
        if (branchId != null) {
            sendToBranch(branchId, request);
        } else {
            // Send to all active users
            List<User> activeUsers = userRepository.findByIsActiveTrue();
            List<Long> userIds = activeUsers.stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
            sendBulkNotifications(request, userIds);
        }
    }

    @Override
    public void sendLowStockAlert(Long productId, Long branchId, int currentStock, int reorderLevel) {
        log.info("Sending low stock alert for product {} in branch {}", productId, branchId);
        
        String title = "Low Stock Alert";
        String message = String.format(
                "Product ID %d has low stock. Current: %d, Reorder Level: %d",
                productId, currentStock, reorderLevel
        );
        
        NotificationRequest request = NotificationRequest.builder()
                .title(title)
                .message(message)
                .type(NotificationType.LOW_STOCK)
                .referenceId(productId)
                .referenceType("PRODUCT")
                .build();
        
        sendToBranch(branchId, request);
    }

    @Override
    public void sendExpiryAlert(Long batchId, Long branchId, int daysToExpiry) {
        log.info("Sending expiry alert for batch {} in branch {}", batchId, branchId);
        
        String title = "Product Expiry Alert";
        String message = String.format(
                "Batch ID %d will expire in %d days",
                batchId, daysToExpiry
        );
        
        NotificationRequest request = NotificationRequest.builder()
                .title(title)
                .message(message)
                .type(NotificationType.EXPIRY_ALERT)
                .referenceId(batchId)
                .referenceType("BATCH")
                .build();
        
        sendToBranch(branchId, request);
    }

    @Override
    public void sendPaymentReminder(Long invoiceId, Long customerId) {
        log.info("Sending payment reminder for invoice {} to customer {}", invoiceId, customerId);
        
        String title = "Payment Reminder";
        String message = String.format("Invoice %d is due for payment", invoiceId);
        
        // Get customer's user if linked
        // For now, this creates a system notification
        NotificationRequest request = NotificationRequest.builder()
                .title(title)
                .message(message)
                .type(NotificationType.PAYMENT_DUE)
                .referenceId(invoiceId)
                .referenceType("INVOICE")
                .build();
        
        // Send to managers/admins
        List<User> managers = userRepository.findByIsActiveTrue().stream()
                .filter(u -> u.getRole().name().equals("MANAGER") || u.getRole().name().equals("ADMIN"))
                .collect(Collectors.toList());
        
        List<Long> userIds = managers.stream()
                .map(User::getId)
                .collect(Collectors.toList());
        
        sendBulkNotifications(request, userIds);
    }

    @Override
    @Async
    public void sendEmailNotification(String to, String subject, String body) {
        log.info("Sending email to: {}", to);
        
        if (mailSender == null) {
            log.warn("Email service is not configured. Cannot send email to: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendSmsNotification(String phoneNumber, String message) {
        log.info("SMS notification requested for: {} (SMS service not configured)", phoneNumber);
        // SMS integration would go here
        // For now, log the request
        log.warn("SMS service is not configured. Message for {}: {}", phoneNumber, message);
    }
}
