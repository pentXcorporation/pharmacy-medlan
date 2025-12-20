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
import com.pharmacy.medlan.model.inventory.ProductBinCard;

@Repository
public interface ProductBinCardRepository extends JpaRepository<ProductBinCard, Long>, JpaSpecificationExecutor<ProductBinCard> {

    List<ProductBinCard> findByProductId(Long productId);

    List<ProductBinCard> findByBranchId(Long branchId);

    List<ProductBinCard> findByProductIdAndBranchId(Long productId, Long branchId);

    List<ProductBinCard> findByTransactionType(TransactionType transactionType);

    List<ProductBinCard> findByReferenceNumber(String referenceNumber);

    List<ProductBinCard> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT pbc FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId ORDER BY pbc.transactionDate DESC, pbc.id DESC")
    List<ProductBinCard> findBinCardByProductAndBranch(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId);

    @Query("SELECT pbc FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId " +
            "AND pbc.transactionDate BETWEEN :startDate AND :endDate " +
            "ORDER BY pbc.transactionDate ASC, pbc.id ASC")
    List<ProductBinCard> findBinCardByProductBranchAndDateRange(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT pbc FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId ORDER BY pbc.id DESC LIMIT 1")
    Optional<ProductBinCard> findLatestBinCardEntry(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId);

    @Query("SELECT SUM(pbc.quantityIn) FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId " +
            "AND pbc.transactionDate BETWEEN :startDate AND :endDate")
    Integer getTotalQuantityIn(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(pbc.quantityOut) FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId " +
            "AND pbc.transactionDate BETWEEN :startDate AND :endDate")
    Integer getTotalQuantityOut(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT pbc FROM ProductBinCard pbc WHERE pbc.branch.id = :branchId " +
            "AND pbc.transactionDate BETWEEN :startDate AND :endDate " +
            "ORDER BY pbc.transactionDate DESC")
    List<ProductBinCard> findBinCardByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(pbc) FROM ProductBinCard pbc WHERE pbc.product.id = :productId " +
            "AND pbc.branch.id = :branchId")
    Long countByProductAndBranch(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId);
}
