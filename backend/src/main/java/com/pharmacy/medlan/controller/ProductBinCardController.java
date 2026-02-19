package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.inventory.ProductBinCard;
import com.pharmacy.medlan.service.inventory.ProductBinCardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bin-cards")
@RequiredArgsConstructor
@Tag(name = "Product Bin Card", description = "Product bin card tracking APIs")
public class ProductBinCardController {

    private final ProductBinCardService productBinCardService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get bin card by product")
    public ResponseEntity<ApiResponse<List<ProductBinCard>>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(productBinCardService.getBinCardByProduct(productId)));
    }

    @GetMapping("/product/{productId}/branch/{branchId}")
    @Operation(summary = "Get bin card by product and branch")
    public ResponseEntity<ApiResponse<List<ProductBinCard>>> getByProductAndBranch(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(
                productBinCardService.getBinCardByProductAndBranch(productId, branchId)));
    }

    @GetMapping("/product/{productId}/branch/{branchId}/date-range")
    @Operation(summary = "Get bin card by product, branch, and date range")
    public ResponseEntity<ApiResponse<List<ProductBinCard>>> getByProductBranchAndDateRange(
            @PathVariable Long productId,
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                productBinCardService.getBinCardByProductBranchAndDateRange(productId, branchId, startDate, endDate)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get bin cards by branch")
    public ResponseEntity<ApiResponse<List<ProductBinCard>>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(productBinCardService.getBinCardByBranch(branchId)));
    }

    @GetMapping("/product/{productId}/branch/{branchId}/balance")
    @Operation(summary = "Get running balance")
    public ResponseEntity<ApiResponse<Integer>> getRunningBalance(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(productBinCardService.getRunningBalance(productId, branchId)));
    }
}
