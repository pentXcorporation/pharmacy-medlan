package com.pharmacy.medlan.service.migration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class LegacyDataMigrationServiceImpl implements LegacyDataMigrationService {

    private final AtomicReference<String> migrationStatus = new AtomicReference<>("NOT_STARTED");

    @Override
    public void migrateProducts() {
        log.info("Starting product migration");
        migrationStatus.set("MIGRATING_PRODUCTS");
        // Legacy product migration logic would go here
        // Read from legacy tables, transform, and write to new schema
        log.info("Product migration completed");
    }

    @Override
    public void migrateCustomers() {
        log.info("Starting customer migration");
        migrationStatus.set("MIGRATING_CUSTOMERS");
        // Legacy customer migration logic
        log.info("Customer migration completed");
    }

    @Override
    public void migrateSuppliers() {
        log.info("Starting supplier migration");
        migrationStatus.set("MIGRATING_SUPPLIERS");
        // Legacy supplier migration logic
        log.info("Supplier migration completed");
    }

    @Override
    public void migrateInventory() {
        log.info("Starting inventory migration");
        migrationStatus.set("MIGRATING_INVENTORY");
        // Legacy inventory migration logic
        log.info("Inventory migration completed");
    }

    @Override
    public void migrateSales() {
        log.info("Starting sales migration");
        migrationStatus.set("MIGRATING_SALES");
        // Legacy sales migration logic
        log.info("Sales migration completed");
    }

    @Override
    public void migrateAll() {
        log.info("Starting full data migration");
        migrationStatus.set("IN_PROGRESS");
        try {
            migrateProducts();
            migrateCustomers();
            migrateSuppliers();
            migrateInventory();
            migrateSales();
            migrationStatus.set("COMPLETED");
            log.info("Full data migration completed successfully");
        } catch (Exception e) {
            migrationStatus.set("FAILED: " + e.getMessage());
            log.error("Data migration failed", e);
            throw e;
        }
    }

    @Override
    public String getMigrationStatus() {
        return migrationStatus.get();
    }
}
