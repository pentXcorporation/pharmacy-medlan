package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.supplier.CreatePurchaseOrderRequest;
import com.pharmacy.medlan.dto.response.supplier.PurchaseOrderResponse;
import com.pharmacy.medlan.enums.PurchaseOrderStatus;
import com.pharmacy.medlan.service.supplier.PurchaseOrderService;
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
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders", description = "APIs for managing purchase orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Create purchase order", description = "Create a new purchase order")
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(
            @Valid @RequestBody CreatePurchaseOrderRequest request) {
        return new ResponseEntity<>(purchaseOrderService.createPurchaseOrder(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase order by ID", description = "Retrieve a purchase order by its ID")
    public ResponseEntity<PurchaseOrderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getById(id));
    }

    @GetMapping("/number/{poNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase order by PO number", description = "Retrieve a purchase order by its number")
    public ResponseEntity<PurchaseOrderResponse> getByPoNumber(@PathVariable String poNumber) {
        return ResponseEntity.ok(purchaseOrderService.getByPoNumber(poNumber));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get all purchase orders", description = "Retrieve all purchase orders with pagination")
    public ResponseEntity<Page<PurchaseOrderResponse>> getAllPurchaseOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders(pageable));
    }

    @GetMapping("/supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase orders by supplier", description = "Retrieve purchase orders for a supplier")
    public ResponseEntity<List<PurchaseOrderResponse>> getBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(purchaseOrderService.getBySupplier(supplierId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase orders by branch", description = "Retrieve purchase orders for a branch")
    public ResponseEntity<List<PurchaseOrderResponse>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(purchaseOrderService.getByBranch(branchId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase orders by status", description = "Retrieve purchase orders by status")
    public ResponseEntity<List<PurchaseOrderResponse>> getByStatus(@PathVariable PurchaseOrderStatus status) {
        return ResponseEntity.ok(purchaseOrderService.getByStatus(status));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get purchase orders by date range", description = "Retrieve purchase orders within a date range")
    public ResponseEntity<List<PurchaseOrderResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(purchaseOrderService.getByDateRange(startDate, endDate));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update purchase order status", description = "Update the status of a purchase order")
    public ResponseEntity<PurchaseOrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam PurchaseOrderStatus status) {
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Approve purchase order", description = "Approve a purchase order")
    public ResponseEntity<PurchaseOrderResponse> approvePurchaseOrder(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.approvePurchaseOrder(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Reject purchase order", description = "Reject a purchase order")
    public ResponseEntity<PurchaseOrderResponse> rejectPurchaseOrder(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(purchaseOrderService.rejectPurchaseOrder(id, reason));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete purchase order", description = "Delete a draft purchase order (admin only)")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }
}
