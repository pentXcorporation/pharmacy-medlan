package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.finance.BankResponse;
import com.pharmacy.medlan.model.finance.Bank;
import com.pharmacy.medlan.service.finance.BankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/banks")
@RequiredArgsConstructor
@Tag(name = "Banks", description = "Bank Account Management APIs")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
public class BankController {

    private final BankService bankService;

    @GetMapping
    @Operation(summary = "Get all banks with pagination")
    public ResponseEntity<ApiResponse<Page<BankResponse>>> getAllBanks(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(bankService.getAllBanks(pageable)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active banks")
    public ResponseEntity<ApiResponse<List<BankResponse>>> getAllActiveBanks() {
        return ResponseEntity.ok(ApiResponse.success(bankService.getAllActiveBanks()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get bank by ID")
    public ResponseEntity<ApiResponse<BankResponse>> getBankById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bankService.getBankById(id)));
    }

    @PostMapping
    @Operation(summary = "Create new bank account")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<BankResponse>> createBank(@RequestBody Bank bank) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(bankService.createBank(bank)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update bank account")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<BankResponse>> updateBank(
            @PathVariable Long id,
            @RequestBody Bank bank) {
        return ResponseEntity.ok(ApiResponse.success(bankService.updateBank(id, bank)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (deactivate) bank account")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBank(@PathVariable Long id) {
        bankService.deleteBank(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/total-balance")
    @Operation(summary = "Get total balance across all banks")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalBalance() {
        return ResponseEntity.ok(ApiResponse.success(bankService.getTotalBalance()));
    }
}
