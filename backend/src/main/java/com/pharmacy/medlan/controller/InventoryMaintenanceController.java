package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory/maintenance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Inventory Maintenance", description = "Administrative tools for inventory data maintenance")
public class InventoryMaintenanceController {

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/sync-branch-inventory")
    @Operation(summary = "Sync branch_inventory from inventory_batches", 
               description = "Rebuilds branch_inventory table by aggregating data from inventory_batches. Use this to fix empty or outdated branch inventory data.")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncBranchInventory() {
        try {
            log.info("Starting branch_inventory synchronization...");

            // Count existing records before sync
            Long beforeCount = (Long) entityManager.createQuery(
                "SELECT COUNT(bi) FROM BranchInventory bi"
            ).getSingleResult();

            // Delete existing branch_inventory records
            int deletedCount = entityManager.createQuery(
                "DELETE FROM BranchInventory"
            ).executeUpdate();
            
            log.info("Deleted {} existing branch_inventory records", deletedCount);

            // Flush to ensure deletes are processed
            entityManager.flush();

            // Insert aggregated data from inventory_batches using native SQL
            String insertSql = """
                INSERT INTO branch_inventory (
                    product_id,
                    branch_id,
                    quantity_on_hand,
                    quantity_available,
                    quantity_allocated,
                    reorder_level,
                    minimum_stock,
                    maximum_stock,
                    created_at,
                    updated_at,
                    created_by,
                    last_modified_by,
                    deleted
                )
                SELECT 
                    ib.product_id,
                    ib.branch_id,
                    COALESCE(SUM(ib.quantity_available), 0) as quantity_on_hand,
                    COALESCE(SUM(ib.quantity_available), 0) as quantity_available,
                    0 as quantity_allocated,
                    COALESCE(MAX(p.reorder_level), 10) as reorder_level,
                    COALESCE(MAX(p.minimum_stock), 5) as minimum_stock,
                    COALESCE(MAX(p.maximum_stock), 100) as maximum_stock,
                    CURRENT_TIMESTAMP as created_at,
                    CURRENT_TIMESTAMP as updated_at,
                    'SYSTEM' as created_by,
                    'SYSTEM' as last_modified_by,
                    false as deleted
                FROM inventory_batches ib
                LEFT JOIN products p ON p.id = ib.product_id
                WHERE ib.quantity_available > 0
                GROUP BY ib.product_id, ib.branch_id
                """;

            int insertedCount = entityManager.createNativeQuery(insertSql).executeUpdate();
            
            log.info("Inserted {} new branch_inventory records", insertedCount);

            // Flush and clear to ensure all changes are committed
            entityManager.flush();
            entityManager.clear();

            // Count records after sync
            Long afterCount = (Long) entityManager.createQuery(
                "SELECT COUNT(bi) FROM BranchInventory bi"
            ).getSingleResult();

            Map<String, Object> result = new HashMap<>();
            result.put("beforeCount", beforeCount);
            result.put("deletedCount", deletedCount);
            result.put("insertedCount", insertedCount);
            result.put("afterCount", afterCount);
            result.put("message", "Branch inventory synchronized successfully");

            log.info("Branch inventory sync completed: {} records now in database", afterCount);

            return ResponseEntity.ok(ApiResponse.success(result));

        } catch (Exception e) {
            log.error("Error syncing branch inventory", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to sync branch inventory: " + e.getMessage()));
        }
    }

    @GetMapping("/branch-inventory-status")
    @Operation(summary = "Get branch inventory status", 
               description = "Returns counts of records in branch_inventory and inventory_batches for comparison")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBranchInventoryStatus() {
        try {
            Long branchInventoryCount = (Long) entityManager.createQuery(
                "SELECT COUNT(bi) FROM BranchInventory bi"
            ).getSingleResult();

            Long inventoryBatchesCount = (Long) entityManager.createQuery(
                "SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.quantityAvailable > 0"
            ).getSingleResult();

            Long productBranchCombinations = (Long) entityManager.createQuery(
                "SELECT COUNT(DISTINCT CONCAT(ib.product.id, '-', ib.branch.id)) FROM InventoryBatch ib WHERE ib.quantityAvailable > 0"
            ).getSingleResult();

            Map<String, Object> status = new HashMap<>();
            status.put("branchInventoryRecords", branchInventoryCount);
            status.put("inventoryBatchesWithStock", inventoryBatchesCount);
            status.put("expectedBranchInventoryRecords", productBranchCombinations);
            status.put("needsSync", !branchInventoryCount.equals(productBranchCombinations));

            return ResponseEntity.ok(ApiResponse.success(status));

        } catch (Exception e) {
            log.error("Error getting branch inventory status", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get status: " + e.getMessage()));
        }
    }

    @GetMapping("/diagnostic/{productId}/{branchId}")
    @Operation(summary = "Diagnostic check for specific product and branch", 
               description = "Returns detailed information about what data exists for a specific product/branch combination")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDiagnostic(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        try {
            Map<String, Object> diagnostic = new HashMap<>();

            // Check if product exists
            Long productExists = (Long) entityManager.createQuery(
                "SELECT COUNT(p) FROM Product p WHERE p.id = :productId"
            ).setParameter("productId", productId).getSingleResult();
            diagnostic.put("productExists", productExists > 0);

            // Check if branch exists
            Long branchExists = (Long) entityManager.createQuery(
                "SELECT COUNT(b) FROM Branch b WHERE b.id = :branchId"
            ).setParameter("branchId", branchId).getSingleResult();
            diagnostic.put("branchExists", branchExists > 0);

            // Check inventory_batches
            Long batchCount = (Long) entityManager.createQuery(
                "SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.product.id = :productId AND ib.branch.id = :branchId"
            ).setParameter("productId", productId)
             .setParameter("branchId", branchId)
             .getSingleResult();
            diagnostic.put("inventoryBatchesCount", batchCount);

            // Check branch_inventory
            Long branchInvCount = (Long) entityManager.createQuery(
                "SELECT COUNT(bi) FROM BranchInventory bi WHERE bi.product.id = :productId AND bi.branch.id = :branchId"
            ).setParameter("productId", productId)
             .setParameter("branchId", branchId)
             .getSingleResult();
            diagnostic.put("branchInventoryExists", branchInvCount > 0);

            // Get all available product/branch combinations
            @SuppressWarnings("unchecked")
            java.util.List<Object[]> combinations = entityManager.createQuery(
                "SELECT ib.product.id, ib.branch.id, SUM(ib.quantityAvailable) FROM InventoryBatch ib " +
                "WHERE ib.quantityAvailable > 0 GROUP BY ib.product.id, ib.branch.id"
            ).setMaxResults(20).getResultList();
            
            diagnostic.put("availableCombinations", combinations.stream()
                .map(row -> Map.of("productId", row[0], "branchId", row[1], "totalQty", row[2]))
                .toList());

            return ResponseEntity.ok(ApiResponse.success(diagnostic));

        } catch (Exception e) {
            log.error("Error getting diagnostic info", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get diagnostic: " + e.getMessage()));
        }
    }
}
