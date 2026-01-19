package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.response.inventory.InventoryTransactionResponse;
import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.inventory.InventoryTransaction;
import com.pharmacy.medlan.repository.inventory.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;

    @Override
    public Page<InventoryTransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<InventoryTransactionResponse> getTransactionsByBranch(Long branchId, Pageable pageable) {
        return transactionRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("branch").get("id"), branchId),
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public Page<InventoryTransactionResponse> getTransactionsByProduct(Long productId, Pageable pageable) {
        return transactionRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("product").get("id"), productId),
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public Page<InventoryTransactionResponse> getTransactionsByType(TransactionType type, Pageable pageable) {
        return transactionRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("transactionType"), type),
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public Page<InventoryTransactionResponse> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return transactionRepository.findAll(
                (root, query, cb) -> cb.between(root.get("transactionDate"), startDate, endDate),
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public InventoryTransactionResponse getTransactionById(Long id) {
        InventoryTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    @Override
    public InventoryTransactionResponse getTransactionByNumber(String transactionNumber) {
        InventoryTransaction transaction = transactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with number: " + transactionNumber));
        return mapToResponse(transaction);
    }

    private InventoryTransactionResponse mapToResponse(InventoryTransaction transaction) {
        return InventoryTransactionResponse.builder()
                .id(transaction.getId())
                .transactionNumber(transaction.getTransactionNumber())
                .productId(transaction.getProduct().getId())
                .productName(transaction.getProduct().getProductName())
                .productCode(transaction.getProduct().getProductCode())
                .branchId(transaction.getBranch().getId())
                .branchName(transaction.getBranch().getBranchName())
                .transactionType(transaction.getTransactionType())
                .quantity(transaction.getQuantity())
                .transactionDate(transaction.getTransactionDate())
                .reason(transaction.getReason())
                .isApproved(transaction.getIsApproved())
                .approvedByName(transaction.getApprovedBy() != null ? 
                    transaction.getApprovedBy().getFullName() : null)
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
