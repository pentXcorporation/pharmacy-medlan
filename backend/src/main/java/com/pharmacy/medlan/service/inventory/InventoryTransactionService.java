package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.response.inventory.InventoryTransactionResponse;
import com.pharmacy.medlan.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryTransactionService {
    Page<InventoryTransactionResponse> getAllTransactions(Pageable pageable);
    Page<InventoryTransactionResponse> getTransactionsByBranch(Long branchId, Pageable pageable);
    Page<InventoryTransactionResponse> getTransactionsByProduct(Long productId, Pageable pageable);
    Page<InventoryTransactionResponse> getTransactionsByType(TransactionType type, Pageable pageable);
    Page<InventoryTransactionResponse> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    InventoryTransactionResponse getTransactionById(Long id);
    InventoryTransactionResponse getTransactionByNumber(String transactionNumber);
}
