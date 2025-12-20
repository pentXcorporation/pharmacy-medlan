package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.pos.CreateSaleReturnRequest;
import com.pharmacy.medlan.dto.response.pos.SaleReturnResponse;
import com.pharmacy.medlan.service.pos.SaleReturnService;
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
@RequestMapping("/api/sale-returns")
@RequiredArgsConstructor
@Tag(name = "Sale Returns", description = "APIs for managing sale returns and refunds")
public class SaleReturnController {

    private final SaleReturnService saleReturnService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Create sale return", description = "Process a sale return")
    public ResponseEntity<SaleReturnResponse> createSaleReturn(@Valid @RequestBody CreateSaleReturnRequest request) {
        return new ResponseEntity<>(saleReturnService.createSaleReturn(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get sale return by ID", description = "Retrieve a sale return by its ID")
    public ResponseEntity<SaleReturnResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(saleReturnService.getById(id));
    }

    @GetMapping("/number/{returnNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get sale return by number", description = "Retrieve a sale return by its number")
    public ResponseEntity<SaleReturnResponse> getByReturnNumber(@PathVariable String returnNumber) {
        return ResponseEntity.ok(saleReturnService.getByReturnNumber(returnNumber));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get all sale returns", description = "Retrieve all sale returns with pagination")
    public ResponseEntity<Page<SaleReturnResponse>> getAllSaleReturns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(saleReturnService.getAllSaleReturns(pageable));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get sale returns by customer", description = "Retrieve returns for a customer")
    public ResponseEntity<List<SaleReturnResponse>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(saleReturnService.getByCustomer(customerId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get sale returns by branch", description = "Retrieve returns for a branch")
    public ResponseEntity<List<SaleReturnResponse>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(saleReturnService.getByBranch(branchId));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER')")
    @Operation(summary = "Get sale returns by date range", description = "Retrieve returns within a date range")
    public ResponseEntity<List<SaleReturnResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(saleReturnService.getByDateRange(startDate, endDate));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete sale return", description = "Delete a sale return (admin only)")
    public ResponseEntity<Void> deleteSaleReturn(@PathVariable Long id) {
        saleReturnService.deleteSaleReturn(id);
        return ResponseEntity.noContent().build();
    }
}
