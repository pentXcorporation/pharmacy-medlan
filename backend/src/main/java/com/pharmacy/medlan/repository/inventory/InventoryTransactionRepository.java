package com.pharmacy.medlan.repository.inventory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.model.inventory.InventoryTransaction;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long>, JpaSpecificationExecutor<InventoryTransaction> {

    Optional<InventoryTransaction> findByTransactionNumber(String transactionNumber);

    List<InventoryTransaction> findByProductId(Long productId);

    List<InventoryTransaction> findByBranchId(Long branchId);

    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);

    List<InventoryTransaction> findByIsApproved(Boolean isApproved);

    List<InventoryTransaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<InventoryTransaction> findByProductIdAndBranchId(Long productId, Long branchId);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.product.id = :productId " +
            "AND it.branch.id = :branchId " +
            "AND it.transactionDate BETWEEN :startDate AND :endDate " +
            "ORDER BY it.transactionDate DESC")
    List<InventoryTransaction> findByProductBranchAndDateRange(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.branch.id = :branchId " +
            "AND it.transactionDate BETWEEN :startDate AND :endDate " +
            "ORDER BY it.transactionDate DESC")
    List<InventoryTransaction> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(it.quantity) FROM InventoryTransaction it " +
            "WHERE it.product.id = :productId AND it.branch.id = :branchId " +
            "AND it.transactionType IN ('SALE', 'RETURN_TO_SUPPLIER', 'TRANSFER_OUT', 'ADJUSTMENT_OUT', 'DAMAGE', 'EXPIRED')")
    Integer getTotalOutQuantity(@Param("productId") Long productId, @Param("branchId") Long branchId);

    @Query("SELECT SUM(it.quantity) FROM InventoryTransaction it " +
            "WHERE it.product.id = :productId AND it.branch.id = :branchId " +
            "AND it.transactionType IN ('PURCHASE', 'RETURN_FROM_CUSTOMER', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'OPENING_STOCK')")
    Integer getTotalInQuantity(@Param("productId") Long productId, @Param("branchId") Long branchId);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.isApproved = false " +
            "ORDER BY it.transactionDate DESC")
    List<InventoryTransaction> findPendingApprovalTransactions();

    @Query("SELECT COUNT(it) FROM InventoryTransaction it WHERE it.transactionType = :type " +
            "AND it.transactionDate BETWEEN :startDate AND :endDate")
    Long countByTypeAndDateRange(
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    boolean existsByTransactionNumber(String transactionNumber);
}
