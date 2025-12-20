package com.pharmacy.medlan.repository.supplier;

import com.pharmacy.medlan.model.supplier.GoodsReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoodsReceiptItemRepository extends JpaRepository<GoodsReceiptItem, Long> {

    List<GoodsReceiptItem> findByGoodsReceiptId(Long goodsReceiptId);

    List<GoodsReceiptItem> findByProductId(Long productId);

    Optional<GoodsReceiptItem> findByGoodsReceiptIdAndProductIdAndBatchNumber(
            Long goodsReceiptId, Long productId, String batchNumber);

    @Query("SELECT gri FROM GoodsReceiptItem gri WHERE gri.product.id = :productId " +
            "AND gri.batchNumber = :batchNumber")
    List<GoodsReceiptItem> findByProductAndBatch(
            @Param("productId") Long productId,
            @Param("batchNumber") String batchNumber);

    @Query("SELECT gri FROM GoodsReceiptItem gri WHERE gri.expiryDate < :date")
    List<GoodsReceiptItem> findExpiredBatches(@Param("date") LocalDate date);

    @Query("SELECT gri FROM GoodsReceiptItem gri WHERE gri.expiryDate BETWEEN :startDate AND :endDate")
    List<GoodsReceiptItem> findBatchesExpiringBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(gri.totalAmount) FROM GoodsReceiptItem gri " +
            "WHERE gri.goodsReceipt.id = :receiptId")
    BigDecimal getTotalAmountByReceipt(@Param("receiptId") Long receiptId);

    @Query("SELECT SUM(gri.quantityReceived) FROM GoodsReceiptItem gri " +
            "WHERE gri.product.id = :productId " +
            "AND gri.goodsReceipt.receiptDate BETWEEN :startDate AND :endDate")
    Integer getTotalReceivedQuantityByProductAndDateRange(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT gri.batchNumber FROM GoodsReceiptItem gri " +
            "WHERE gri.product.id = :productId")
    List<String> findAllBatchNumbersByProduct(@Param("productId") Long productId);
}
