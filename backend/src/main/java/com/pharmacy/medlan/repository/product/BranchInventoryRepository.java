package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.BranchInventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchInventoryRepository extends JpaRepository<BranchInventory, Long> {

    Optional<BranchInventory> findByProductIdAndBranchId(Long productId, Long branchId);

    List<BranchInventory> findByBranchId(Long branchId);

    Page<BranchInventory> findByBranchId(Long branchId, Pageable pageable);

    List<BranchInventory> findByProductId(Long productId);

    @Query("SELECT bi FROM BranchInventory bi WHERE bi.branch.id = :branchId " +
            "AND bi.quantityAvailable < bi.reorderLevel")
    List<BranchInventory> findLowStockItems(@Param("branchId") Long branchId);

    @Query("SELECT bi FROM BranchInventory bi WHERE bi.branch.id = :branchId " +
            "AND bi.quantityAvailable < bi.reorderLevel AND bi.quantityAvailable > 0")
    List<BranchInventory> findLowStockByBranch(@Param("branchId") Long branchId);

    @Query("SELECT bi FROM BranchInventory bi WHERE bi.branch.id = :branchId " +
            "AND bi.quantityAvailable <= 0")
    List<BranchInventory> findOutOfStockByBranch(@Param("branchId") Long branchId);

    @Query("SELECT SUM(bi.quantityOnHand) FROM BranchInventory bi WHERE bi.product.id = :productId")
    Integer getTotalStockByProduct(@Param("productId") Long productId);
}