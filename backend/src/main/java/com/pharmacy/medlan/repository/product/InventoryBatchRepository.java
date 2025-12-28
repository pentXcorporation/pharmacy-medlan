package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {

    /**
     * Find all batches for a branch
     */
    List<InventoryBatch> findByBranchId(Long branchId);
    
    /**
     * Find all active batches for a branch
     */
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.branch.id = :branchId AND ib.isActive = true")
    List<InventoryBatch> findAllByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.product.id = :productId " +
            "AND ib.branch.id = :branchId AND ib.isActive = true " +
            "AND ib.quantityAvailable > 0 ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findAvailableBatchesByProductOrderByExpiryDateAsc(
            @Param("productId") Long productId, @Param("branchId") Long branchId);

    /**
     * Alias for FEFO-sorted available batches
     */
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.product.id = :productId " +
            "AND ib.branch.id = :branchId AND ib.isActive = true " +
            "AND ib.isExpired = false AND ib.quantityAvailable > 0 " +
            "ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findAvailableBatchesByProductAndBranch(
            @Param("productId") Long productId, @Param("branchId") Long branchId);

    /**
     * Get all batches including expired for audit/stock-taking
     */
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.product.id = :productId " +
            "AND ib.branch.id = :branchId ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findAllByProductIdAndBranchId(
            @Param("productId") Long productId, @Param("branchId") Long branchId);

    List<InventoryBatch> findByProductIdAndBranchId(Long productId, Long branchId);

    Optional<InventoryBatch> findByProductIdAndBranchIdAndBatchNumber(
            Long productId, Long branchId, String batchNumber);

    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.expiryDate < :date " +
            "AND ib.isActive = true AND ib.quantityAvailable > 0")
    List<InventoryBatch> findExpiredBatches(@Param("date") LocalDate date);

    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.expiryDate BETWEEN :startDate AND :endDate " +
            "AND ib.isActive = true AND ib.quantityAvailable > 0")
    List<InventoryBatch> findBatchesExpiringBetween(
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.branch.id = :branchId " +
            "AND ib.expiryDate <= :alertDate AND ib.isActive = true " +
            "AND ib.quantityAvailable > 0 ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findExpiringBatchesForAlert(
            @Param("branchId") Long branchId, @Param("alertDate") LocalDate alertDate);

    /**
     * Find batches expiring within specified days
     */
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.branch.id = :branchId " +
            "AND ib.expiryDate BETWEEN CURRENT_DATE AND :maxDate " +
            "AND ib.isActive = true AND ib.quantityAvailable > 0 " +
            "ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findBatchesExpiringWithin(
            @Param("branchId") Long branchId, @Param("maxDate") LocalDate maxDate);

    /**
     * Find already expired batches by branch
     */
    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.branch.id = :branchId " +
            "AND ib.expiryDate < CURRENT_DATE AND ib.quantityAvailable > 0")
    List<InventoryBatch> findExpiredBatchesByBranch(@Param("branchId") Long branchId);

    /**
     * Count expired batches by branch
     */
    @Query("SELECT COUNT(ib) FROM InventoryBatch ib WHERE ib.branch.id = :branchId " +
            "AND ib.expiryDate < CURRENT_DATE AND ib.quantityAvailable > 0")
    Long countExpiredBatchesByBranch(@Param("branchId") Long branchId);

    /**
     * Get total available quantity for a product across all branches
     */
    @Query("SELECT COALESCE(SUM(ib.quantityAvailable), 0) FROM InventoryBatch ib " +
            "WHERE ib.product.id = :productId AND ib.isActive = true AND ib.isExpired = false")
    Integer getTotalAvailableQuantity(@Param("productId") Long productId);

    /**
     * Get total available quantity for a product at a specific branch
     */
    @Query("SELECT COALESCE(SUM(ib.quantityAvailable), 0) FROM InventoryBatch ib " +
            "WHERE ib.product.id = :productId AND ib.branch.id = :branchId " +
            "AND ib.isActive = true AND ib.isExpired = false")
    Integer getTotalAvailableQuantityAtBranch(
            @Param("productId") Long productId, @Param("branchId") Long branchId);
}