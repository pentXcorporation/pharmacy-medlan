package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.Invoice;
import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByCustomerId(Long customerId);

    List<Invoice> findByBranchId(Long branchId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);

    List<Invoice> findByBranchIdAndStatus(Long branchId, InvoiceStatus status);

    List<Invoice> findByCustomerIdAndPaymentStatus(Long customerId, PaymentStatus paymentStatus);

    @Query("SELECT i FROM Invoice i WHERE i.branch.id = :branchId " +
            "AND i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Invoice i WHERE i.customer.id = :customerId " +
            "AND i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByCustomerAndDateRange(
            @Param("customerId") Long customerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.branch.id = :branchId " +
            "AND i.invoiceDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalSalesByBranchAndDate(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(i.balanceAmount) FROM Invoice i WHERE i.customer.id = :customerId " +
            "AND i.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalOutstandingByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT SUM(i.balanceAmount) FROM Invoice i WHERE i.branch.id = :branchId " +
            "AND i.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalOutstandingByBranch(@Param("branchId") Long branchId);

    @Query("SELECT i FROM Invoice i WHERE i.paymentStatus IN ('UNPAID', 'PARTIALLY_PAID') " +
            "AND i.dueDate < :date")
    List<Invoice> findOverdueInvoices(@Param("date") LocalDate date);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    Long countByStatus(@Param("status") InvoiceStatus status);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.branch.id = :branchId " +
            "AND i.invoiceDate BETWEEN :startDate AND :endDate")
    Long countByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Invoice i WHERE i.doctorName = :doctorName " +
            "AND i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByDoctorAndDateRange(
            @Param("doctorName") String doctorName,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT i.doctorName FROM Invoice i WHERE i.doctorName IS NOT NULL")
    List<String> findAllDoctorNames();

    boolean existsByInvoiceNumber(String invoiceNumber);
}