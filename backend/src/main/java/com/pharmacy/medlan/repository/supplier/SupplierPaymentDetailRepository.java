package com.pharmacy.medlan.repository.supplier;

import com.pharmacy.medlan.model.supplier.SupplierPaymentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierPaymentDetailRepository extends JpaRepository<SupplierPaymentDetail, Long> {

    List<SupplierPaymentDetail> findBySupplierPaymentId(Long supplierPaymentId);

    List<SupplierPaymentDetail> findByGrnId(Long grnId);

    Optional<SupplierPaymentDetail> findBySupplierPaymentIdAndGrnId(Long supplierPaymentId, Long grnId);

    @Query("SELECT spd FROM SupplierPaymentDetail spd WHERE spd.invoiceNumber = :invoiceNumber")
    List<SupplierPaymentDetail> findByInvoiceNumber(@Param("invoiceNumber") String invoiceNumber);

    @Query("SELECT SUM(spd.paidAmount) FROM SupplierPaymentDetail spd " +
            "WHERE spd.grn.id = :grnId")
    BigDecimal getTotalPaidAmountByGrn(@Param("grnId") Long grnId);

    @Query("SELECT SUM(spd.paidAmount) FROM SupplierPaymentDetail spd " +
            "WHERE spd.supplierPayment.id = :paymentId")
    BigDecimal getTotalPaidAmountByPayment(@Param("paymentId") Long paymentId);

    @Query("SELECT spd FROM SupplierPaymentDetail spd " +
            "WHERE spd.supplierPayment.supplier.id = :supplierId")
    List<SupplierPaymentDetail> findBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT spd FROM SupplierPaymentDetail spd " +
            "WHERE spd.balanceAmount > 0")
    List<SupplierPaymentDetail> findWithPendingBalance();
}
