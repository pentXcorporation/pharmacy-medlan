package com.pharmacy.medlan.repository.inventory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.enums.GRNStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.inventory.GRN;

@Repository
public interface GRNRepository extends JpaRepository<GRN, Long>, JpaSpecificationExecutor<GRN> {

    Optional<GRN> findByGrnNumber(String grnNumber);

    List<GRN> findBySupplierId(Long supplierId);

    List<GRN> findByBranchId(Long branchId);

    List<GRN> findByStatus(GRNStatus status);

    List<GRN> findByPaymentStatus(PaymentStatus paymentStatus);

    List<GRN> findByReceivedDateBetween(LocalDate startDate, LocalDate endDate);

    Optional<GRN> findByPurchaseOrderId(Long purchaseOrderId);

    List<GRN> findBySupplierIdAndStatus(Long supplierId, GRNStatus status);

    List<GRN> findByBranchIdAndStatus(Long branchId, GRNStatus status);

    @Query("SELECT g FROM GRN g WHERE g.branch.id = :branchId " +
            "AND g.receivedDate BETWEEN :startDate AND :endDate")
    List<GRN> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT g FROM GRN g WHERE g.supplier.id = :supplierId " +
            "AND g.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID')")
    List<GRN> findUnpaidGRNsBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT SUM(g.netAmount) FROM GRN g WHERE g.branch.id = :branchId " +
            "AND g.receivedDate BETWEEN :startDate AND :endDate " +
            "AND g.status = 'COMPLETED'")
    BigDecimal getTotalReceiptsByBranch(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(g.balanceAmount) FROM GRN g WHERE g.supplier.id = :supplierId " +
            "AND g.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalOutstandingBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT SUM(g.balanceAmount) FROM GRN g " +
            "WHERE g.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalOutstandingBalance();

    @Query("SELECT COUNT(g) FROM GRN g WHERE g.status = :status")
    Long countByStatus(@Param("status") GRNStatus status);

    @Query("SELECT g FROM GRN g WHERE g.status = 'PENDING_APPROVAL'")
    List<GRN> findPendingApprovalGRNs();

    @Query("SELECT g FROM GRN g WHERE g.supplierInvoiceNumber = :invoiceNumber " +
            "AND g.supplier.id = :supplierId")
    Optional<GRN> findBySupplierInvoice(
            @Param("invoiceNumber") String invoiceNumber,
            @Param("supplierId") Long supplierId);

    boolean existsByGrnNumber(String grnNumber);

    boolean existsByPurchaseOrderId(Long purchaseOrderId);
}
