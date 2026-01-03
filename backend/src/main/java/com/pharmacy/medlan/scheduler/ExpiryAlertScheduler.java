package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.notification.NotificationRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduler for monitoring and alerting about expiring inventory batches
 * Runs daily at 6 AM as configured in application.properties
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ExpiryAlertScheduler {

    private final InventoryBatchRepository inventoryBatchRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Daily expiry check - runs at 6 AM
     * Checks all active batches and creates alerts based on days to expiry:
     * - CRITICAL: 0-30 days (RED)
     * - HIGH: 31-60 days (ORANGE)  
     * - MEDIUM: 61-90 days (YELLOW)
     */
    @Scheduled(cron = "${scheduler.expiry.cron:0 0 6 * * ?}")
    @Transactional
    public void checkExpiringBatches() {
        log.info("=== Starting Expiry Alert Check ===");
        
        LocalDate today = LocalDate.now();
        LocalDate ninetyDaysFromNow = today.plusDays(90);
        
        // Get all active, non-expired batches expiring in next 90 days
        List<InventoryBatch> expiringBatches = inventoryBatchRepository
                .findByExpiryDateBetweenAndIsActiveAndIsExpired(
                        today, ninetyDaysFromNow, true, false);
        
        log.info("Found {} batches expiring in next 90 days", expiringBatches.size());
        
        int criticalCount = 0;
        int highCount = 0;
        int mediumCount = 0;
        
        for (InventoryBatch batch : expiringBatches) {
            long daysToExpiry = ChronoUnit.DAYS.between(today, batch.getExpiryDate());
            
            AlertLevel alertLevel;
            String alertMessage;
            
            if (daysToExpiry <= 30) {
                alertLevel = AlertLevel.CRITICAL;
                alertMessage = String.format(
                        "URGENT: Batch %s of %s expires in %d days! Quantity: %d",
                        batch.getBatchNumber(),
                        batch.getProduct().getProductName(),
                        daysToExpiry,
                        batch.getQuantityAvailable()
                );
                criticalCount++;
            } else if (daysToExpiry <= 60) {
                alertLevel = AlertLevel.URGENT;
                alertMessage = String.format(
                        "HIGH PRIORITY: Batch %s of %s expires in %d days. Quantity: %d - Consider discount/return",
                        batch.getBatchNumber(),
                        batch.getProduct().getProductName(),
                        daysToExpiry,
                        batch.getQuantityAvailable()
                );
                highCount++;
            } else {
                alertLevel = AlertLevel.WARNING;
                alertMessage = String.format(
                        "Batch %s of %s expires in %d days. Quantity: %d - Plan usage",
                        batch.getBatchNumber(),
                        batch.getProduct().getProductName(),
                        daysToExpiry,
                        batch.getQuantityAvailable()
                );
                mediumCount++;
            }
            
            // Create notification for branch managers and pharmacists
            createExpiryNotification(batch, alertLevel, alertMessage);
        }
        
        log.info("Expiry Alert Summary - Critical: {}, High: {}, Medium: {}",
                criticalCount, highCount, mediumCount);
        log.info("=== Expiry Alert Check Complete ===");
    }

    /**
     * Updates batch expiry status - marks expired batches
     * Runs daily at 1 AM as configured in application.properties
     */
    @Scheduled(cron = "${scheduler.update-expiry-status.cron:0 0 1 * * ?}")
    @Transactional
    public void updateExpiredBatches() {
        log.info("=== Updating Expired Batch Status ===");
        
        LocalDate today = LocalDate.now();
        
        // Find all active batches that have expired
        List<InventoryBatch> expiredBatches = inventoryBatchRepository
                .findByExpiryDateBeforeAndIsExpiredFalse(today);
        
        log.info("Found {} newly expired batches", expiredBatches.size());
        
        for (InventoryBatch batch : expiredBatches) {
            batch.setIsExpired(true);
            batch.setIsActive(false); // Block from sales
            
            String message = String.format(
                    "EXPIRED: Batch %s of %s has expired. Quantity: %d - Remove from inventory immediately!",
                    batch.getBatchNumber(),
                    batch.getProduct().getProductName(),
                    batch.getQuantityAvailable()
            );
            
            createExpiryNotification(batch, AlertLevel.CRITICAL, message);
            
            log.warn("Batch {} of product {} marked as EXPIRED", 
                    batch.getBatchNumber(), batch.getProduct().getProductCode());
        }
        
        inventoryBatchRepository.saveAll(expiredBatches);
        
        log.info("=== Expired Batch Status Update Complete ===");
    }

    private void createExpiryNotification(InventoryBatch batch, AlertLevel alertLevel, String message) {
        // Get all admins, branch managers, and pharmacists for the branch
        List<User> recipientUsers = userRepository
                .findByBranchIdAndRoleIn(
                        batch.getBranch().getId(),
                        List.of("ADMIN", "BRANCH_MANAGER", "PHARMACIST", "INVENTORY_MANAGER")
                );
        
        for (User user : recipientUsers) {
            Notification notification = Notification.builder()
                    .user(user)
                    .type(NotificationType.EXPIRY_ALERT)
                    .title("Product Expiry Alert")
                    .message(message)
                    .priority(alertLevel.name())
                    .referenceType("INVENTORY_BATCH")
                    .referenceId(batch.getId())
                    .isRead(false)
                    .build();
            
            notificationRepository.save(notification);
        }
    }
}
