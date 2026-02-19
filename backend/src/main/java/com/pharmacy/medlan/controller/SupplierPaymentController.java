package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.supplier.SupplierPayment;
import com.pharmacy.medlan.service.supplier.SupplierPaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/supplier-payments")
@RequiredArgsConstructor
@Tag(name = "Supplier Payments", description = "Supplier payment management APIs")
public class SupplierPaymentController {

    private final SupplierPaymentService supplierPaymentService;

    @GetMapping
    @Operation(summary = "Get all supplier payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<SupplierPayment>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getAllPayments(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier payment by ID")
    public ResponseEntity<ApiResponse<SupplierPayment>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getById(id)));
    }

    @GetMapping("/number/{paymentNumber}")
    @Operation(summary = "Get supplier payment by payment number")
    public ResponseEntity<ApiResponse<SupplierPayment>> getByPaymentNumber(@PathVariable String paymentNumber) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getByPaymentNumber(paymentNumber)));
    }

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get payments by supplier")
    public ResponseEntity<ApiResponse<List<SupplierPayment>>> getBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getBySupplier(supplierId)));
    }

    @GetMapping("/method/{paymentMethod}")
    @Operation(summary = "Get payments by payment method")
    public ResponseEntity<ApiResponse<List<SupplierPayment>>> getByPaymentMethod(@PathVariable PaymentMethod paymentMethod) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getByPaymentMethod(paymentMethod)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status")
    public ResponseEntity<ApiResponse<List<SupplierPayment>>> getByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getByStatus(status)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get payments by date range")
    public ResponseEntity<ApiResponse<List<SupplierPayment>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(supplierPaymentService.getByDateRange(startDate, endDate)));
    }

    @GetMapping("/supplier/{supplierId}/date-range")
    @Operation(summary = "Get payments by supplier and date range")
    public ResponseEntity<ApiResponse<List<SupplierPayment>>> getBySupplierAndDateRange(
            @PathVariable Long supplierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                supplierPaymentService.getBySupplierAndDateRange(supplierId, startDate, endDate)));
    }
}
