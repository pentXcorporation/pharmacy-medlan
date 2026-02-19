package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.supplier.SupplierPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SupplierPaymentService {

    SupplierPayment getById(Long id);

    SupplierPayment getByPaymentNumber(String paymentNumber);

    List<SupplierPayment> getBySupplier(Long supplierId);

    List<SupplierPayment> getByPaymentMethod(PaymentMethod paymentMethod);

    List<SupplierPayment> getByStatus(PaymentStatus status);

    List<SupplierPayment> getByDateRange(LocalDate startDate, LocalDate endDate);

    List<SupplierPayment> getBySupplierAndDateRange(Long supplierId, LocalDate startDate, LocalDate endDate);

    Page<SupplierPayment> getAllPayments(Pageable pageable);

    String generatePaymentNumber();
}
