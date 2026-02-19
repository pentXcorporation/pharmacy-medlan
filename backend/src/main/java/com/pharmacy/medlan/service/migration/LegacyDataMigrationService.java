package com.pharmacy.medlan.service.migration;

public interface LegacyDataMigrationService {

    void migrateProducts();

    void migrateCustomers();

    void migrateSuppliers();

    void migrateInventory();

    void migrateSales();

    void migrateAll();

    String getMigrationStatus();
}
