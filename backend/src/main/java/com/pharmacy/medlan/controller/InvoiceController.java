package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.pos.InvoiceResponse;
import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.service.pos.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Invoice Management APIs")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoiceById(id)));
    }

    @GetMapping("/number/{invoiceNumber}")
    @Operation(summary = "Get invoice by number")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByNumber(
            @PathVariable String invoiceNumber) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoiceByNumber(invoiceNumber)));
    }

    @GetMapping
    @Operation(summary = "Get all invoices with pagination")
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getAllInvoices(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getAllInvoices(pageable)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get invoices by branch")
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getInvoicesByBranch(
            @PathVariable Long branchId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoicesByBranch(branchId, pageable)));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get invoices by customer")
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getInvoicesByCustomer(
            @PathVariable Long customerId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoicesByCustomer(customerId, pageable)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get invoices by date range")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                invoiceService.getInvoicesByDateRange(startDate, endDate)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get invoices by status")
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getInvoicesByStatus(
            @PathVariable InvoiceStatus status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoicesByStatus(status, pageable)));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    @Operation(summary = "Get invoices by payment status")
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getInvoicesByPaymentStatus(
            @PathVariable PaymentStatus paymentStatus, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                invoiceService.getInvoicesByPaymentStatus(paymentStatus, pageable)));
    }

    @PostMapping("/{id}/payment")
    @Operation(summary = "Record payment for invoice")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> recordPayment(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String paymentReference) {
        return ResponseEntity.ok(ApiResponse.success("Payment recorded", 
                invoiceService.recordPayment(id, amount, paymentReference)));
    }

    @GetMapping("/customer/{customerId}/outstanding")
    @Operation(summary = "Get total outstanding amount by customer")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalOutstandingByCustomer(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(
                invoiceService.getTotalOutstandingByCustomer(customerId)));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getOverdueInvoices() {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getOverdueInvoices()));
    }
}
