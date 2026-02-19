package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.service.inventory.ExpiryManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler for periodic report generation and inventory checks.
 * Runs daily summaries, expiry checks, and low stock alerts.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ReportGenerationScheduler {

    private final ExpiryManagementService expiryManagementService;

    /**
     * Generate daily expiry alerts at 6:00 AM every day
     */
    @Scheduled(cron = "0 0 6 * * *")
    public void generateDailyExpiryAlerts() {
        log.info("Running scheduled expiry alert generation...");
        try {
            expiryManagementService.generateExpiryAlerts(null, 90); // all branches, 90 days threshold
            log.info("Expiry alert generation completed successfully");
        } catch (Exception e) {
            log.error("Error during scheduled expiry alert generation", e);
        }
    }

    /**
     * Process expired products at midnight every day
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void processExpiredProducts() {
        log.info("Running scheduled expired product processing...");
        try {
            expiryManagementService.processExpiredBatches();
            log.info("Expired product processing completed successfully");
        } catch (Exception e) {
            log.error("Error during scheduled expired product processing", e);
        }
    }
}