package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.inventory.BarcodeScanRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.inventory.ScanResultResponse;
import com.pharmacy.medlan.enums.ScanContext;
import com.pharmacy.medlan.service.inventory.InventoryScanService;
import com.pharmacy.medlan.validation.annotation.RateLimit;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scan")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Barcode Scanning", description = "APIs for barcode/QR code scanning operations")
public class ScanController {

    private final InventoryScanService inventoryScanService;

    @PostMapping
    @Operation(summary = "Process scan", description = "Process a barcode or QR code scan with context")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER')")
    @RateLimit(requests = 100, duration = 60, scope = RateLimit.Scope.USER)
    public ResponseEntity<ApiResponse<ScanResultResponse>> processScan(
            @Valid @RequestBody BarcodeScanRequest request) {
        log.info("Processing scan: {} for context: {}", request.getScanData(), request.getContext());
        ScanResultResponse result = inventoryScanService.processScan(request);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Scan processed successfully", result));
        } else {
            return ResponseEntity.ok(ApiResponse.error(result.getErrorMessage(), result));
        }
    }

    @GetMapping("/pos/{barcode}")
    @Operation(summary = "Quick POS lookup", description = "Quick product lookup for Point of Sale")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @RateLimit(requests = 200, duration = 60, scope = RateLimit.Scope.USER)
    public ResponseEntity<ApiResponse<ScanResultResponse>> quickPOSLookup(
            @PathVariable String barcode,
            @RequestParam Long branchId) {
        log.info("Quick POS lookup: barcode={}, branch={}", barcode, branchId);
        ScanResultResponse result = inventoryScanService.quickLookupForPOS(barcode, branchId);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(result));
        } else {
            return ResponseEntity.ok(ApiResponse.error(result.getErrorMessage(), result));
        }
    }

    @GetMapping("/receiving/{barcode}")
    @Operation(summary = "Lookup for receiving", description = "Product lookup for goods receiving")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<ScanResultResponse>> lookupForReceiving(
            @PathVariable String barcode,
            @RequestParam Long branchId) {
        log.info("Lookup for receiving: barcode={}, branch={}", barcode, branchId);
        ScanResultResponse result = inventoryScanService.lookupForReceiving(barcode, branchId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/stock-taking/{barcode}")
    @Operation(summary = "Lookup for stock taking", description = "Product lookup for physical inventory")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<ScanResultResponse>> lookupForStockTaking(
            @PathVariable String barcode,
            @RequestParam Long branchId) {
        log.info("Lookup for stock taking: barcode={}, branch={}", barcode, branchId);
        ScanResultResponse result = inventoryScanService.lookupForStockTaking(barcode, branchId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify product", description = "Verify product authenticity via QR code")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<ScanResultResponse>> verifyProduct(
            @RequestParam String qrData) {
        log.info("Verifying product via QR");
        ScanResultResponse result = inventoryScanService.verifyProduct(qrData);
        return ResponseEntity.ok(ApiResponse.success("Verification complete", result));
    }

    @PostMapping("/batch-qr")
    @Operation(summary = "Process batch QR", description = "Process batch-level QR code scan")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<ScanResultResponse>> processBatchQR(
            @RequestParam String qrData,
            @RequestParam Long branchId) {
        log.info("Processing batch QR for branch: {}", branchId);
        ScanResultResponse result = inventoryScanService.processBatchQRScan(qrData, branchId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk scan processing", description = "Process multiple barcodes at once")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    @RateLimit(requests = 10, duration = 60, scope = RateLimit.Scope.USER, bucket = "bulk_scan")
    public ResponseEntity<ApiResponse<List<ScanResultResponse>>> processBulkScans(
            @RequestBody List<String> barcodes,
            @RequestParam Long branchId,
            @Parameter(description = "Scan context") @RequestParam(defaultValue = "STOCK_TAKING") ScanContext context) {
        log.info("Processing bulk scans: {} barcodes for context: {}", barcodes.size(), context);
        
        if (barcodes.size() > 100) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Maximum 100 barcodes allowed per request"));
        }
        
        List<ScanResultResponse> results = inventoryScanService.processBulkScans(barcodes, branchId, context);
        return ResponseEntity.ok(ApiResponse.success("Bulk scan processed", results));
    }

    @GetMapping("/history")
    @Operation(summary = "Get scan history", description = "Get recent scan history for audit")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ScanResultResponse>>> getScanHistory(
            @RequestParam Long branchId,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "50") int limit) {
        log.info("Getting scan history for branch: {}", branchId);
        List<ScanResultResponse> history = inventoryScanService.getScanHistory(branchId, userId, limit);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/contexts")
    @Operation(summary = "Get scan contexts", description = "Get all available scan contexts")
    public ResponseEntity<ApiResponse<ScanContext[]>> getScanContexts() {
        return ResponseEntity.ok(ApiResponse.success(ScanContext.values()));
    }
}
