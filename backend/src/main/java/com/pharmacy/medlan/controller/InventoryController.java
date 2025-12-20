package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryBatchResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryResponse;
import com.pharmacy.medlan.service.inventory.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory Management APIs")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/product/{productId}/branch/{branchId}")
    @Operation(summary = "Get inventory by product and branch")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByProductAndBranch(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getInventoryByProductAndBranch(productId, branchId)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get all inventory by branch")
    public ResponseEntity<ApiResponse<Page<InventoryResponse>>> getInventoryByBranch(
            @PathVariable Long branchId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getInventoryByBranch(branchId, pageable)));
    }

    @GetMapping("/branch/{branchId}/low-stock")
    @Operation(summary = "Get low stock inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getLowStockInventory(
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getLowStockInventory(branchId)));
    }

    @GetMapping("/branch/{branchId}/out-of-stock")
    @Operation(summary = "Get out of stock inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getOutOfStockInventory(
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getOutOfStockInventory(branchId)));
    }

    @GetMapping("/batches/product/{productId}/branch/{branchId}")
    @Operation(summary = "Get batches by product and branch")
    public ResponseEntity<ApiResponse<List<InventoryBatchResponse>>> getBatchesByProduct(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getBatchesByProduct(productId, branchId)));
    }

    @GetMapping("/branch/{branchId}/expiring")
    @Operation(summary = "Get expiring batches")
    public ResponseEntity<ApiResponse<List<InventoryBatchResponse>>> getExpiringBatches(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate alertDate) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getExpiringBatches(branchId, alertDate)));
    }

    @GetMapping("/branch/{branchId}/expired")
    @Operation(summary = "Get expired batches")
    public ResponseEntity<ApiResponse<List<InventoryBatchResponse>>> getExpiredBatches(
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getExpiredBatches(branchId)));
    }

    @GetMapping("/available-quantity/product/{productId}/branch/{branchId}")
    @Operation(summary = "Get available quantity for a product")
    public ResponseEntity<ApiResponse<Integer>> getAvailableQuantity(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.getAvailableQuantity(productId, branchId)));
    }
}
