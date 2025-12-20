package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.response.pos.InvoiceResponse;
import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface InvoiceService {

    InvoiceResponse getInvoiceById(Long id);

    InvoiceResponse getInvoiceByNumber(String invoiceNumber);

    Page<InvoiceResponse> getAllInvoices(Pageable pageable);

    Page<InvoiceResponse> getInvoicesByBranch(Long branchId, Pageable pageable);

    Page<InvoiceResponse> getInvoicesByCustomer(Long customerId, Pageable pageable);

    List<InvoiceResponse> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate);

    Page<InvoiceResponse> getInvoicesByStatus(InvoiceStatus status, Pageable pageable);

    Page<InvoiceResponse> getInvoicesByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    InvoiceResponse recordPayment(Long invoiceId, BigDecimal amount, String paymentReference);

    BigDecimal getTotalOutstandingByCustomer(Long customerId);

    List<InvoiceResponse> getOverdueInvoices();
}
