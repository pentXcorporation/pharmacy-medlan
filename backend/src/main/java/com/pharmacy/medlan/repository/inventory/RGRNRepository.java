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

import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.inventory.RGRN;

@Repository
public interface RGRNRepository extends JpaRepository<RGRN, Long>, JpaSpecificationExecutor<RGRN> {

    Optional<RGRN> findByRgrnNumber(String rgrnNumber);

    List<RGRN> findBySupplierId(Long supplierId);

    List<RGRN> findByBranchId(Long branchId);

    List<RGRN> findByOriginalGrnId(Long originalGrnId);

    List<RGRN> findByRefundStatus(PaymentStatus refundStatus);

    List<RGRN> findByReturnDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT r FROM RGRN r WHERE r.supplier.id = :supplierId " +
            "AND r.refundStatus = 'PENDING'")
    List<RGRN> findPendingRefundsBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT r FROM RGRN r WHERE r.branch.id = :branchId " +
            "AND r.returnDate BETWEEN :startDate AND :endDate")
    List<RGRN> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(r.totalReturnAmount) FROM RGRN r WHERE r.supplier.id = :supplierId " +
            "AND r.returnDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalReturnsBySupplierAndDateRange(
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(r.totalReturnAmount) FROM RGRN r WHERE r.branch.id = :branchId " +
            "AND r.returnDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalReturnsByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(r) FROM RGRN r WHERE r.refundStatus = :status")
    Long countByRefundStatus(@Param("status") PaymentStatus status);

    boolean existsByRgrnNumber(String rgrnNumber);
}
