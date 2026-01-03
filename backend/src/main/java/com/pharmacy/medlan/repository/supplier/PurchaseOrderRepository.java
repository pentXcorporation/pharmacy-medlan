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

import com.pharmacy.medlan.enums.PurchaseOrderStatus;
import com.pharmacy.medlan.model.supplier.PurchaseOrder;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>, JpaSpecificationExecutor<PurchaseOrder> {

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    List<PurchaseOrder> findBySupplierId(Long supplierId);

    List<PurchaseOrder> findByBranchId(Long branchId);

    List<PurchaseOrder> findByStatus(PurchaseOrderStatus status);

    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    List<PurchaseOrder> findBySupplierIdAndStatus(Long supplierId, PurchaseOrderStatus status);

    List<PurchaseOrder> findByBranchIdAndStatus(Long branchId, PurchaseOrderStatus status);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = :status " +
            "AND po.expectedDeliveryDate < :date")
    List<PurchaseOrder> findOverduePurchaseOrders(
            @Param("status") PurchaseOrderStatus status,
            @Param("date") LocalDate date);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.branch.id = :branchId " +
            "AND po.orderDate BETWEEN :startDate AND :endDate")
    List<PurchaseOrder> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.supplier.id = :supplierId " +
            "AND po.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalOrderAmountBySupplier(
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.branch.id = :branchId " +
            "AND po.orderDate BETWEEN :startDate AND :endDate " +
            "AND po.status IN ('APPROVED', 'PARTIALLY_RECEIVED', 'COMPLETED')")
    BigDecimal getTotalPurchasesByBranch(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = :status")
    Long countByStatus(@Param("status") PurchaseOrderStatus status);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = 'DRAFT' " +
            "AND po.createdByUser.id = :userId")
    List<PurchaseOrder> findDraftOrdersByUser(@Param("userId") Long userId);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = 'PENDING_APPROVAL'")
    List<PurchaseOrder> findPendingApprovalOrders();

    boolean existsByPoNumber(String poNumber);

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.branch.id = :branchId " +
            "AND CAST(po.status AS string) = :status")
    int countByBranchIdAndStatus(
            @Param("branchId") Long branchId,
            @Param("status") String status);
}
