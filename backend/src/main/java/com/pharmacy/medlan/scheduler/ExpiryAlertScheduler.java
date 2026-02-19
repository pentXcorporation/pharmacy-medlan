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
import java.util.ArrayList;
import java.util.List;

/**
 * Scheduler for monitoring and alerting about expiring inventory batches.
 * Runs on schedules configured in application.properties.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ExpiryAlertScheduler {

    private final InventoryBatchRepository inventoryBatchRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private static final List<String> ALERT_ROLES = List.of("ADMIN", "BRANCH_MANAGER", "PHARMACIST", "INVENTORY_MANAGER");

    /**
     * Daily expiry check — runs at 6 AM (configurable).
     * Alert tiers based on days to expiry:
     *   CRITICAL  : 0–30 days
     *   URGENT    : 31–60 days
     *   WARNING   : 61–90 days
     */
    @Scheduled(cron = "${scheduler.expiry.cron:0 0 6 * * ?}")
    @Transactional
    public void checkExpiringBatches() {
        log.info("=== Starting Expiry Alert Check ===");

        LocalDate today = LocalDate.now();
        LocalDate ninetyDaysFromNow = today.plusDays(90);

        List<InventoryBatch> expiringBatches = inventoryBatchRepository
                .findByExpiryDateBetweenAndIsActiveAndIsExpired(today, ninetyDaysFromNow, true, false);

        log.info("Found {} batches expiring in next 90 days", expiringBatches.size());

        int criticalCount = 0, urgentCount = 0, warningCount = 0;
        List<Notification> notifications = new ArrayList<>();

        for (InventoryBatch batch : expiringBatches) {
            long daysToExpiry = ChronoUnit.DAYS.between(today, batch.getExpiryDate());

            AlertLevel alertLevel;
            String alertMessage;

            if (daysToExpiry <= 30) {
                alertLevel = AlertLevel.CRITICAL;
                alertMessage = String.format(
                        "URGENT: Batch %s of %s expires in %d day(s)! Available qty: %d",
                        batch.getBatchNumber(), batch.getProduct().getProductName(),
                        daysToExpiry, batch.getQuantityAvailable());
                criticalCount++;
            } else if (daysToExpiry <= 60) {
                alertLevel = AlertLevel.URGENT;
                alertMessage = String.format(
                        "HIGH PRIORITY: Batch %s of %s expires in %d days. Qty: %d — consider discount or return.",
                        batch.getBatchNumber(), batch.getProduct().getProductName(),
                        daysToExpiry, batch.getQuantityAvailable());
                urgentCount++;
            } else {
                alertLevel = AlertLevel.WARNING;
                alertMessage = String.format(
                        "Batch %s of %s expires in %d days. Qty: %d — plan usage accordingly.",
                        batch.getBatchNumber(), batch.getProduct().getProductName(),
                        daysToExpiry, batch.getQuantityAvailable());
                warningCount++;
            }

            notifications.addAll(buildExpiryNotifications(batch, alertLevel, alertMessage));
        }

        // Batch insert — avoids N individual INSERTs
        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }

        log.info("Expiry Alert Summary — Critical: {}, Urgent: {}, Warning: {}",
                criticalCount, urgentCount, warningCount);
        log.info("=== Expiry Alert Check Complete ===");
    }

    /**
     * Marks expired batches inactive — runs daily at 1 AM (configurable).
     */
    @Scheduled(cron = "${scheduler.update-expiry-status.cron:0 0 1 * * ?}")
    @Transactional
    public void updateExpiredBatches() {
        log.info("=== Updating Expired Batch Status ===");

        LocalDate today = LocalDate.now();
        List<InventoryBatch> expiredBatches = inventoryBatchRepository
                .findByExpiryDateBeforeAndIsExpiredFalse(today);

        log.info("Found {} newly expired batches", expiredBatches.size());

        List<Notification> notifications = new ArrayList<>();

        for (InventoryBatch batch : expiredBatches) {
            batch.setIsExpired(true);
            batch.setIsActive(false); // Prevent expired stock from appearing in sales

            String message = String.format(
                    "EXPIRED: Batch %s of %s has expired. Qty: %d — remove from inventory immediately!",
                    batch.getBatchNumber(), batch.getProduct().getProductName(), batch.getQuantityAvailable());

            notifications.addAll(buildExpiryNotifications(batch, AlertLevel.CRITICAL, message));
            log.warn("Batch {} of product {} marked EXPIRED", batch.getBatchNumber(), batch.getProduct().getProductCode());
        }

        inventoryBatchRepository.saveAll(expiredBatches);
        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }

        log.info("=== Expired Batch Status Update Complete ===");
    }

    /**
     * Builds Notification objects for all relevant users in a batch's branch.
     * Does NOT persist — caller is responsible for saveAll.
     */
    private List<Notification> buildExpiryNotifications(InventoryBatch batch, AlertLevel alertLevel, String message) {
        List<User> recipients = userRepository.findByBranchIdAndRoleIn(batch.getBranch().getId(), ALERT_ROLES);

        List<Notification> result = new ArrayList<>(recipients.size());
        for (User user : recipients) {
            result.add(Notification.builder()
                    .user(user)
                    .type(NotificationType.EXPIRY_ALERT)
                    .title("Product Expiry Alert")
                    .message(message)
                    .priority(alertLevel.name())
                    .referenceType("INVENTORY_BATCH")
                    .referenceId(batch.getId())
                    .isRead(false)
                    .build());
        }
        return result;
    }
}