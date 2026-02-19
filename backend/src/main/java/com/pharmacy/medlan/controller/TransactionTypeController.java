package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.finance.TransactionType;
import com.pharmacy.medlan.service.finance.TransactionTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction-types")
@RequiredArgsConstructor
@Tag(name = "Transaction Types", description = "Financial transaction type management APIs")
public class TransactionTypeController {

    private final TransactionTypeService transactionTypeService;

    @PostMapping
    @Operation(summary = "Create transaction type")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<TransactionType>> create(
            @RequestParam String typeName,
            @RequestParam String description,
            @RequestParam Boolean isIncome) {
        TransactionType created = transactionTypeService.createTransactionType(typeName, description, isIncome);
        return ResponseEntity.ok(ApiResponse.success("Transaction type created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update transaction type")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<TransactionType>> update(
            @PathVariable Long id,
            @RequestParam String typeName,
            @RequestParam String description,
            @RequestParam Boolean isIncome) {
        TransactionType updated = transactionTypeService.updateTransactionType(id, typeName, description, isIncome);
        return ResponseEntity.ok(ApiResponse.success("Transaction type updated successfully", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction type by ID")
    public ResponseEntity<ApiResponse<TransactionType>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(transactionTypeService.getById(id)));
    }

    @GetMapping("/name/{typeName}")
    @Operation(summary = "Get transaction type by name")
    public ResponseEntity<ApiResponse<TransactionType>> getByName(@PathVariable String typeName) {
        return ResponseEntity.ok(ApiResponse.success(transactionTypeService.getByTypeName(typeName)));
    }

    @GetMapping
    @Operation(summary = "Get all transaction types")
    public ResponseEntity<ApiResponse<List<TransactionType>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(transactionTypeService.getAllTransactionTypes()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active transaction types")
    public ResponseEntity<ApiResponse<List<TransactionType>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(transactionTypeService.getActiveTransactionTypes()));
    }

    @GetMapping("/income-type/{isIncome}")
    @Operation(summary = "Get transaction types by income/expense type")
    public ResponseEntity<ApiResponse<List<TransactionType>>> getByIncomeType(@PathVariable Boolean isIncome) {
        return ResponseEntity.ok(ApiResponse.success(transactionTypeService.getByIncomeType(isIncome)));
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate transaction type")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        transactionTypeService.deactivateTransactionType(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction type deactivated"));
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate transaction type")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<Void>> activate(@PathVariable Long id) {
        transactionTypeService.activateTransactionType(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction type activated"));
    }
}
