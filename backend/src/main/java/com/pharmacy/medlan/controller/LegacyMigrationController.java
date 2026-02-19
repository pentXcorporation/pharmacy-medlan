package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.service.migration.LegacyDataMigrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/migration")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Legacy Migration", description = "Legacy data migration APIs")
public class LegacyMigrationController {

    private final LegacyDataMigrationService migrationService;

    @PostMapping("/all")
    @Operation(summary = "Run full migration", description = "Migrate all legacy data")
    public ResponseEntity<ApiResponse<String>> migrateAll() {
        migrationService.migrateAll();
        return ResponseEntity.ok(ApiResponse.success("Full migration completed", migrationService.getMigrationStatus()));
    }

    @PostMapping("/products")
    @Operation(summary = "Migrate products")
    public ResponseEntity<ApiResponse<Void>> migrateProducts() {
        migrationService.migrateProducts();
        return ResponseEntity.ok(ApiResponse.success("Product migration completed"));
    }

    @PostMapping("/customers")
    @Operation(summary = "Migrate customers")
    public ResponseEntity<ApiResponse<Void>> migrateCustomers() {
        migrationService.migrateCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customer migration completed"));
    }

    @PostMapping("/suppliers")
    @Operation(summary = "Migrate suppliers")
    public ResponseEntity<ApiResponse<Void>> migrateSuppliers() {
        migrationService.migrateSuppliers();
        return ResponseEntity.ok(ApiResponse.success("Supplier migration completed"));
    }

    @PostMapping("/inventory")
    @Operation(summary = "Migrate inventory")
    public ResponseEntity<ApiResponse<Void>> migrateInventory() {
        migrationService.migrateInventory();
        return ResponseEntity.ok(ApiResponse.success("Inventory migration completed"));
    }

    @PostMapping("/sales")
    @Operation(summary = "Migrate sales")
    public ResponseEntity<ApiResponse<Void>> migrateSales() {
        migrationService.migrateSales();
        return ResponseEntity.ok(ApiResponse.success("Sales migration completed"));
    }

    @GetMapping("/status")
    @Operation(summary = "Get migration status")
    public ResponseEntity<ApiResponse<String>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success(migrationService.getMigrationStatus()));
    }
}
