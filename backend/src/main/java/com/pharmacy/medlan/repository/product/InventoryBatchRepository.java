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

    @Query("SELECT ib FROM InventoryBatch ib WHERE ib.product.id = :productId " +
            "AND ib.branch.id = :branchId AND ib.isActive = true " +
            "AND ib.quantityAvailable > 0 ORDER BY ib.expiryDate ASC")
    List<InventoryBatch> findAvailableBatchesByProductOrderByExpiryDateAsc(
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
}