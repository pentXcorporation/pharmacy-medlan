package com.pharmacy.medlan.repository.supplier;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.model.supplier.GoodsReceipt;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long>, JpaSpecificationExecutor<GoodsReceipt> {

    Optional<GoodsReceipt> findByReceiptNumber(String receiptNumber);

    List<GoodsReceipt> findBySupplierId(Long supplierId);

    List<GoodsReceipt> findByBranchId(Long branchId);

    List<GoodsReceipt> findByPurchaseOrderId(Long purchaseOrderId);

    List<GoodsReceipt> findByReceiptDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT gr FROM GoodsReceipt gr WHERE gr.supplier.id = :supplierId " +
            "AND gr.receiptDate BETWEEN :startDate AND :endDate")
    List<GoodsReceipt> findBySupplierAndDateRange(
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT gr FROM GoodsReceipt gr WHERE gr.branch.id = :branchId " +
            "AND gr.receiptDate BETWEEN :startDate AND :endDate")
    List<GoodsReceipt> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(gr.totalAmount) FROM GoodsReceipt gr WHERE gr.supplier.id = :supplierId " +
            "AND gr.receiptDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalReceiptsBySupplierAndDateRange(
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(gr.totalAmount) FROM GoodsReceipt gr WHERE gr.branch.id = :branchId " +
            "AND gr.receiptDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalReceiptsByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT gr FROM GoodsReceipt gr WHERE gr.supplierInvoiceNumber = :invoiceNumber " +
            "AND gr.supplier.id = :supplierId")
    Optional<GoodsReceipt> findBySupplierInvoice(
            @Param("invoiceNumber") String invoiceNumber,
            @Param("supplierId") Long supplierId);

    boolean existsByReceiptNumber(String receiptNumber);
}
