package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.pos.CreateSaleRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.service.pos.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@Tag(name = "Sales", description = "POS Sales Management APIs")
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    @Operation(summary = "Create a new sale")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER')")
    public ResponseEntity<ApiResponse<SaleResponse>> createSale(
            @Valid @RequestBody CreateSaleRequest request) {
        SaleResponse sale = saleService.createSale(request);
        return ResponseEntity.ok(ApiResponse.success("Sale created successfully", sale));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sale by ID")
    public ResponseEntity<ApiResponse<SaleResponse>> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getSaleById(id)));
    }

    @GetMapping("/number/{saleNumber}")
    @Operation(summary = "Get sale by sale number")
    public ResponseEntity<ApiResponse<SaleResponse>> getSaleBySaleNumber(
            @PathVariable String saleNumber) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getSaleBySaleNumber(saleNumber)));
    }

    @GetMapping
    @Operation(summary = "Get all sales with pagination")
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getAllSales(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getAllSales(pageable)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get sales by branch")
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getSalesByBranch(
            @PathVariable Long branchId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getSalesByBranch(branchId, pageable)));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get sales by customer")
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getSalesByCustomer(
            @PathVariable Long customerId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getSalesByCustomer(customerId, pageable)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get sales by date range")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                saleService.getSalesByDateRange(startDate, endDate)));
    }

    @GetMapping("/branch/{branchId}/date-range")
    @Operation(summary = "Get sales by branch and date range")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getSalesByBranchAndDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                saleService.getSalesByBranchAndDateRange(branchId, startDate, endDate)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get sales by status")
    public ResponseEntity<ApiResponse<Page<SaleResponse>>> getSalesByStatus(
            @PathVariable SaleStatus status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(saleService.getSalesByStatus(status, pageable)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a sale")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SaleResponse>> cancelSale(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success("Sale cancelled", saleService.cancelSale(id, reason)));
    }

    @PostMapping("/{id}/void")
    @Operation(summary = "Void a sale")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SaleResponse>> voidSale(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success("Sale voided", saleService.voidSale(id, reason)));
    }

    @GetMapping("/branch/{branchId}/total")
    @Operation(summary = "Get total sales amount by branch and date range")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalSales(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                saleService.getTotalSalesByBranchAndDate(branchId, startDate, endDate)));
    }

    @GetMapping("/branch/{branchId}/count")
    @Operation(summary = "Get sales count by branch and date range")
    public ResponseEntity<ApiResponse<Long>> getSalesCount(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                saleService.getSalesCountByBranchAndDate(branchId, startDate, endDate)));
    }
}
