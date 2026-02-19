package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.supplier.SupplierPayment;
import com.pharmacy.medlan.repository.supplier.SupplierPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierPaymentServiceImpl implements SupplierPaymentService {

    private final SupplierPaymentRepository supplierPaymentRepository;

    @Override
    public SupplierPayment getById(Long id) {
        return supplierPaymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier payment not found with id: " + id));
    }

    @Override
    public SupplierPayment getByPaymentNumber(String paymentNumber) {
        return supplierPaymentRepository.findByPaymentNumber(paymentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier payment not found with number: " + paymentNumber));
    }

    @Override
    public List<SupplierPayment> getBySupplier(Long supplierId) {
        return supplierPaymentRepository.findBySupplierId(supplierId);
    }

    @Override
    public List<SupplierPayment> getByPaymentMethod(PaymentMethod paymentMethod) {
        return supplierPaymentRepository.findByPaymentMethod(paymentMethod);
    }

    @Override
    public List<SupplierPayment> getByStatus(PaymentStatus status) {
        return supplierPaymentRepository.findByStatus(status);
    }

    @Override
    public List<SupplierPayment> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return supplierPaymentRepository.findByPaymentDateBetween(startDate, endDate);
    }

    @Override
    public List<SupplierPayment> getBySupplierAndDateRange(Long supplierId, LocalDate startDate, LocalDate endDate) {
        return supplierPaymentRepository.findBySupplierIdAndPaymentDateBetween(supplierId, startDate, endDate);
    }

    @Override
    public Page<SupplierPayment> getAllPayments(Pageable pageable) {
        return supplierPaymentRepository.findAll(pageable);
    }

    @Override
    public String generatePaymentNumber() {
        String prefix = "SPAY-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-";
        Long count = supplierPaymentRepository.count() + 1;
        return prefix + String.format("%05d", count);
    }
}
