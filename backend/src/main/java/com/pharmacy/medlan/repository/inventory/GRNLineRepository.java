package com.pharmacy.medlan.repository.inventory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.model.inventory.GRNLine;

@Repository
public interface GRNLineRepository extends JpaRepository<GRNLine, Long> {

    List<GRNLine> findByGrnId(Long grnId);

    List<GRNLine> findByProductId(Long productId);

    Optional<GRNLine> findByGrnIdAndProductIdAndBatchNumber(Long grnId, Long productId, String batchNumber);

    @Query("SELECT gl FROM GRNLine gl WHERE gl.product.id = :productId " +
            "AND gl.batchNumber = :batchNumber")
    List<GRNLine> findByProductAndBatch(
            @Param("productId") Long productId,
            @Param("batchNumber") String batchNumber);

    @Query("SELECT gl FROM GRNLine gl WHERE gl.expiryDate < :date")
    List<GRNLine> findExpiredBatches(@Param("date") LocalDate date);

    @Query("SELECT gl FROM GRNLine gl WHERE gl.expiryDate BETWEEN :startDate AND :endDate")
    List<GRNLine> findBatchesExpiringBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(gl.totalAmount) FROM GRNLine gl WHERE gl.grn.id = :grnId")
    BigDecimal getTotalAmountByGrn(@Param("grnId") Long grnId);

    @Query("SELECT SUM(gl.quantityReceived) FROM GRNLine gl WHERE gl.product.id = :productId " +
            "AND gl.grn.receivedDate BETWEEN :startDate AND :endDate")
    Integer getTotalReceivedQuantityByProductAndDateRange(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT gl.batchNumber FROM GRNLine gl WHERE gl.product.id = :productId")
    List<String> findAllBatchNumbersByProduct(@Param("productId") Long productId);
}
