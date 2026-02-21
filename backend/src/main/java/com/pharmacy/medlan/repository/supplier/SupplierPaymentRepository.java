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

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.supplier.SupplierPayment;

@Repository
public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment, Long>, JpaSpecificationExecutor<SupplierPayment> {

    Optional<SupplierPayment> findByPaymentNumber(String paymentNumber);

    List<SupplierPayment> findBySupplierId(Long supplierId);

    List<SupplierPayment> findByPaymentMethod(PaymentMethod paymentMethod);

    List<SupplierPayment> findByStatus(PaymentStatus status);

    List<SupplierPayment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    List<SupplierPayment> findBySupplierIdAndPaymentDateBetween(
            Long supplierId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT sp FROM SupplierPayment sp WHERE sp.supplier.id = :supplierId " +
            "ORDER BY sp.paymentDate DESC")
    List<SupplierPayment> findPaymentsBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT SUM(sp.amount) FROM SupplierPayment sp WHERE sp.supplier.id = :supplierId " +
            "AND sp.status = 'PAID'")
    BigDecimal getTotalPaymentsBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT SUM(sp.amount) FROM SupplierPayment sp WHERE sp.paymentDate BETWEEN :startDate AND :endDate " +
            "AND sp.status = 'PAID'")
    BigDecimal getTotalPaymentsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(sp.amount) FROM SupplierPayment sp WHERE sp.supplier.id = :supplierId " +
            "AND sp.paymentDate BETWEEN :startDate AND :endDate AND sp.status = 'PAID'")
    BigDecimal getTotalPaymentsBySupplierAndDateRange(
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT sp FROM SupplierPayment sp WHERE sp.chequeNumber = :chequeNumber")
    Optional<SupplierPayment> findByChequeNumber(@Param("chequeNumber") String chequeNumber);

    @Query("SELECT sp FROM SupplierPayment sp WHERE sp.status = 'PENDING'")
    List<SupplierPayment> findPendingPayments();
    
    // Branch isolation methods
    List<SupplierPayment> findByBranchId(Long branchId);
    
    @Query("SELECT sp FROM SupplierPayment sp WHERE sp.branch.id = :branchId AND sp.supplier.id = :supplierId " +
            "ORDER BY sp.paymentDate DESC")
    List<SupplierPayment> findPaymentsByBranchAndSupplier(@Param("branchId") Long branchId, 
                                                          @Param("supplierId") Long supplierId);
    
    @Query("SELECT SUM(sp.amount) FROM SupplierPayment sp WHERE sp.branch.id = :branchId " +
            "AND sp.paymentDate BETWEEN :startDate AND :endDate AND sp.status = 'PAID'")
    BigDecimal getTotalPaymentsByBranchAndDateRange(@Param("branchId") Long branchId,
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(sp) FROM SupplierPayment sp WHERE sp.paymentMethod = :method " +
            "AND sp.paymentDate BETWEEN :startDate AND :endDate")
    Long countByMethodAndDateRange(
            @Param("method") PaymentMethod method,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    boolean existsByPaymentNumber(String paymentNumber);

    boolean existsByChequeNumber(String chequeNumber);
}
