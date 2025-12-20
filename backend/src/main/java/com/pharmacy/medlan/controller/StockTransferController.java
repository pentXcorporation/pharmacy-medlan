package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.inventory.ApproveStockTransferRequest;
import com.pharmacy.medlan.dto.request.inventory.CreateStockTransferRequest;
import com.pharmacy.medlan.dto.response.inventory.StockTransferResponse;
import com.pharmacy.medlan.enums.StockTransferStatus;
import com.pharmacy.medlan.service.inventory.StockTransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stock-transfers")
@RequiredArgsConstructor
@Tag(name = "Stock Transfer", description = "APIs for managing stock transfers between branches")
public class StockTransferController {

    private final StockTransferService stockTransferService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Create stock transfer", description = "Create a new stock transfer request")
    public ResponseEntity<StockTransferResponse> createStockTransfer(
            @Valid @RequestBody CreateStockTransferRequest request) {
        return new ResponseEntity<>(stockTransferService.createStockTransfer(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get stock transfer by ID", description = "Retrieve a stock transfer by its ID")
    public ResponseEntity<StockTransferResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stockTransferService.getById(id));
    }

    @GetMapping("/number/{transferNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get stock transfer by number", description = "Retrieve a stock transfer by its number")
    public ResponseEntity<StockTransferResponse> getByTransferNumber(@PathVariable String transferNumber) {
        return ResponseEntity.ok(stockTransferService.getByTransferNumber(transferNumber));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get all stock transfers", description = "Retrieve all stock transfers with pagination")
    public ResponseEntity<Page<StockTransferResponse>> getAllStockTransfers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(stockTransferService.getAllStockTransfers(pageable));
    }

    @GetMapping("/from-branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get transfers by source branch", description = "Retrieve transfers originating from a branch")
    public ResponseEntity<List<StockTransferResponse>> getByFromBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(stockTransferService.getByFromBranch(branchId));
    }

    @GetMapping("/to-branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get transfers by destination branch", description = "Retrieve transfers destined to a branch")
    public ResponseEntity<List<StockTransferResponse>> getByToBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(stockTransferService.getByToBranch(branchId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get transfers by branch", description = "Retrieve all transfers involving a branch")
    public ResponseEntity<List<StockTransferResponse>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(stockTransferService.getByBranch(branchId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get transfers by status", description = "Retrieve transfers by status")
    public ResponseEntity<List<StockTransferResponse>> getByStatus(@PathVariable StockTransferStatus status) {
        return ResponseEntity.ok(stockTransferService.getByStatus(status));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get transfers by date range", description = "Retrieve transfers within a date range")
    public ResponseEntity<List<StockTransferResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(stockTransferService.getByDateRange(startDate, endDate));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Approve stock transfer", description = "Approve a pending stock transfer")
    public ResponseEntity<StockTransferResponse> approveStockTransfer(
            @PathVariable Long id,
            @RequestBody(required = false) ApproveStockTransferRequest request) {
        return ResponseEntity.ok(stockTransferService.approveStockTransfer(id, request));
    }

    @PostMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Receive stock transfer", description = "Mark a stock transfer as received")
    public ResponseEntity<StockTransferResponse> receiveStockTransfer(
            @PathVariable Long id,
            @RequestParam Long receivedByUserId) {
        return ResponseEntity.ok(stockTransferService.receiveStockTransfer(id, receivedByUserId));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Reject stock transfer", description = "Reject a pending stock transfer")
    public ResponseEntity<StockTransferResponse> rejectStockTransfer(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(stockTransferService.rejectStockTransfer(id, reason));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Cancel stock transfer", description = "Cancel a stock transfer")
    public ResponseEntity<StockTransferResponse> cancelStockTransfer(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(stockTransferService.cancelStockTransfer(id, reason));
    }
}
