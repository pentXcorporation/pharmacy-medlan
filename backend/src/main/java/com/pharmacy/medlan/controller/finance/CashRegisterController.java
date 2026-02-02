package com.pharmacy.medlan.controller.finance;

import com.pharmacy.medlan.dto.finance.*;
import com.pharmacy.medlan.service.finance.CashRegisterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cash-register")
@RequiredArgsConstructor
@Slf4j
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> openRegister(@Valid @RequestBody OpenCashRegisterRequest request) {
        log.info("Opening cash register for branch: {}", request.getBranchId());
        CashRegisterResponse response = cashRegisterService.openRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> closeRegister(
            @PathVariable Long id,
            @Valid @RequestBody CloseCashRegisterRequest request) {
        log.info("Closing cash register: {}", id);
        CashRegisterResponse response = cashRegisterService.closeRegister(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cash-in")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> recordCashIn(
            @PathVariable Long id,
            @Valid @RequestBody CashTransactionRequest request) {
        log.info("Recording cash in for register: {}", id);
        CashRegisterResponse response = cashRegisterService.recordCashIn(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cash-out")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> recordCashOut(
            @PathVariable Long id,
            @Valid @RequestBody CashTransactionRequest request) {
        log.info("Recording cash out for register: {}", id);
        CashRegisterResponse response = cashRegisterService.recordCashOut(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/deposit")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER')")
    public ResponseEntity<CashRegisterResponse> depositToBank(
            @PathVariable Long id,
            @Valid @RequestBody BankDepositRequest request) {
        log.info("Depositing to bank for register: {}", id);
        CashRegisterResponse response = cashRegisterService.depositToBank(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> getCurrentRegister(@RequestParam Long branchId) {
        log.info("Getting current register for branch: {}", branchId);
        CashRegisterResponse response = cashRegisterService.getCurrentRegister(branchId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<CashRegisterResponse> getRegisterById(@PathVariable Long id) {
        log.info("Getting register by id: {}", id);
        CashRegisterResponse response = cashRegisterService.getRegisterById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER')")
    public ResponseEntity<Page<CashRegisterResponse>> getAllRegisters(
            @PageableDefault(size = 20, sort = "registerDate", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Getting all registers with pagination");
        Page<CashRegisterResponse> response = cashRegisterService.getAllRegisters(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<Page<CashRegisterResponse>> getRegistersByBranch(
            @PathVariable Long branchId,
            @PageableDefault(size = 20, sort = "registerDate", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Getting registers for branch: {}", branchId);
        Page<CashRegisterResponse> response = cashRegisterService.getRegistersByBranch(branchId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/branch/{branchId}/date-range")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER')")
    public ResponseEntity<List<CashRegisterResponse>> getRegistersByDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting registers for branch: {} between {} and {}", branchId, startDate, endDate);
        List<CashRegisterResponse> response = cashRegisterService.getRegistersByDateRange(branchId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER', 'CASHIER')")
    public ResponseEntity<List<CashRegisterTransactionResponse>> getRegisterTransactions(@PathVariable Long id) {
        log.info("Getting transactions for register: {}", id);
        List<CashRegisterTransactionResponse> response = cashRegisterService.getRegisterTransactions(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/daily-summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT', 'MANAGER')")
    public ResponseEntity<CashRegisterSummaryResponse> getDailySummary(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Getting daily summary for branch: {} on date: {}", branchId, date);
        CashRegisterSummaryResponse response = cashRegisterService.getDailySummary(branchId, date);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<Void> deleteRegister(@PathVariable Long id) {
        log.info("Deleting register: {}", id);
        cashRegisterService.deleteRegister(id);
        return ResponseEntity.noContent().build();
    }
}
