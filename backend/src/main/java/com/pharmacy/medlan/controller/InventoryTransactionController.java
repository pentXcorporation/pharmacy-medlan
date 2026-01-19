package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryTransactionResponse;
import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.service.inventory.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/inventory-transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<Page<InventoryTransactionResponse>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryTransactionResponse> transactions = transactionService.getAllTransactions(pageable);
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", transactions));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<Page<InventoryTransactionResponse>>> getTransactionsByBranch(
            @PathVariable Long branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryTransactionResponse> transactions = transactionService.getTransactionsByBranch(branchId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Branch transactions retrieved successfully", transactions));
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<Page<InventoryTransactionResponse>>> getTransactionsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryTransactionResponse> transactions = transactionService.getTransactionsByProduct(productId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Product transactions retrieved successfully", transactions));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<Page<InventoryTransactionResponse>>> getTransactionsByType(
            @PathVariable TransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryTransactionResponse> transactions = transactionService.getTransactionsByType(type, pageable);
        return ResponseEntity.ok(ApiResponse.success("Transactions by type retrieved successfully", transactions));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<InventoryTransactionResponse>> getTransactionById(@PathVariable Long id) {
        InventoryTransactionResponse transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", transaction));
    }

    @GetMapping("/number/{transactionNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<InventoryTransactionResponse>> getTransactionByNumber(
            @PathVariable String transactionNumber) {
        InventoryTransactionResponse transaction = transactionService.getTransactionByNumber(transactionNumber);
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", transaction));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<Page<InventoryTransactionResponse>>> getTransactionsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryTransactionResponse> transactions = transactionService.getTransactionsByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("Transactions by date range retrieved successfully", transactions));
    }
}
