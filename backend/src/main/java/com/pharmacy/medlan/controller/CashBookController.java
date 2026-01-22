package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.finance.CashBookResponse;
import com.pharmacy.medlan.service.finance.CashBookService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/cashbook")
@RequiredArgsConstructor
@Tag(name = "Cash Book", description = "Cash Book Management APIs")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')")
public class CashBookController {

    private final CashBookService cashBookService;

    @GetMapping
    @Operation(summary = "Get all cash book entries with pagination")
    public ResponseEntity<ApiResponse<Page<CashBookResponse>>> getAllCashBook(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(cashBookService.getAllCashBook(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cash book entry by ID")
    public ResponseEntity<ApiResponse<CashBookResponse>> getCashBookById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(cashBookService.getCashBookById(id)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get cash book entries by branch")
    public ResponseEntity<ApiResponse<List<CashBookResponse>>> getCashBookByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(cashBookService.getCashBookByBranch(branchId)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get cash book entries by date range")
    public ResponseEntity<ApiResponse<List<CashBookResponse>>> getCashBookByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                cashBookService.getCashBookByDateRange(startDate, endDate)));
    }

    @GetMapping("/branch/{branchId}/date-range")
    @Operation(summary = "Get cash book entries by branch and date range")
    public ResponseEntity<ApiResponse<List<CashBookResponse>>> getCashBookByBranchAndDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                cashBookService.getCashBookByBranchAndDateRange(branchId, startDate, endDate)));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get cash book summary (opening balance, receipts, payments, closing balance)")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getCashBookSummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
                cashBookService.getCashBookSummary(branchId, startDate, endDate)));
    }
}
