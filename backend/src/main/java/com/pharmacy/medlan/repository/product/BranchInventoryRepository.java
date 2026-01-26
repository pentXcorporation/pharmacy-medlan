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

    @Query("SELECT bi FROM BranchInventory bi " +
           "JOIN FETCH bi.product p " +
           "JOIN FETCH bi.branch b " +
           "WHERE bi.branch.id = :branchId")
    Page<BranchInventory> findByBranchId(@Param("branchId") Long branchId, Pageable pageable);

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

    @Query("SELECT bi FROM BranchInventory bi WHERE bi.quantityAvailable < bi.reorderLevel AND bi.quantityAvailable > 0")
    List<BranchInventory> findAllLowStock();

    @Query("SELECT bi FROM BranchInventory bi " +
           "JOIN FETCH bi.product p " +
           "JOIN FETCH bi.branch b " +
           "WHERE bi.quantityAvailable < bi.reorderLevel AND bi.quantityAvailable > 0")
    Page<BranchInventory> findAllLowStock(Pageable pageable);

    @Query("SELECT bi FROM BranchInventory bi WHERE bi.quantityAvailable <= 0")
    List<BranchInventory> findAllOutOfStock();
    
    /**
     * Count inventory items by branch
     */
    @Query("SELECT COUNT(bi) FROM BranchInventory bi WHERE bi.branch.id = :branchId")
    Long countByBranchId(@Param("branchId") Long branchId);
    
    /**
     * Count out of stock items by branch
     */
    @Query("SELECT COUNT(bi) FROM BranchInventory bi WHERE bi.branch.id = :branchId AND bi.quantityAvailable <= 0")
    Long countOutOfStockByBranchId(@Param("branchId") Long branchId);
    
    /**
     * Count all out of stock items across all branches
     */
    @Query("SELECT COUNT(bi) FROM BranchInventory bi WHERE bi.quantityAvailable <= 0")
    Long countAllOutOfStock();
    
    /**
     * Calculate total inventory value across all branches
     */
    @Query("SELECT COALESCE(SUM(bi.quantityAvailable * p.costPrice), 0) FROM BranchInventory bi JOIN bi.product p")
    java.math.BigDecimal calculateTotalInventoryValue();
}