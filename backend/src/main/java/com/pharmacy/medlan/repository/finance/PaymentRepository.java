package com.pharmacy.medlan.repository.finance;

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
import com.pharmacy.medlan.model.pos.Payment;

@Repository("financePaymentRepository")
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findByReferenceNumber(String referenceNumber);

    List<Payment> findByInvoiceId(Long invoiceId);

    List<Payment> findBySaleId(Long saleId);

    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Payment p WHERE p.invoice.id = :invoiceId ORDER BY p.paymentDate DESC")
    List<Payment> findPaymentsByInvoice(@Param("invoiceId") Long invoiceId);

    @Query("SELECT p FROM Payment p WHERE p.sale.id = :saleId ORDER BY p.paymentDate DESC")
    List<Payment> findPaymentsBySale(@Param("saleId") Long saleId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.invoice.id = :invoiceId AND p.status = 'PAID'")
    BigDecimal getTotalPaidAmountByInvoice(@Param("invoiceId") Long invoiceId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.sale.id = :saleId AND p.status = 'PAID'")
    BigDecimal getTotalPaidAmountBySale(@Param("saleId") Long saleId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate " +
            "AND p.status = 'PAID'")
    BigDecimal getTotalPaymentsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate " +
            "AND p.paymentMethod = :method AND p.status = 'PAID'")
    BigDecimal getTotalPaymentsByMethodAndDateRange(
            @Param("method") PaymentMethod method,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :method " +
            "AND p.paymentDate BETWEEN :startDate AND :endDate")
    Long countByMethodAndDateRange(
            @Param("method") PaymentMethod method,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
