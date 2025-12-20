package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.response.pos.InvoiceResponse;
import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.InvoiceMapper;
import com.pharmacy.medlan.model.pos.Invoice;
import com.pharmacy.medlan.repository.pos.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return invoiceMapper.toResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with number: " + invoiceNumber));
        return invoiceMapper.toResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByBranch(Long branchId, Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByCustomer(Long customerId, Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate) {
        return invoiceMapper.toResponseList(invoiceRepository.findByInvoiceDateBetween(startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByStatus(InvoiceStatus status, Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    public InvoiceResponse recordPayment(Long invoiceId, BigDecimal amount, String paymentReference) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.CANCELLED || invoice.getStatus() == InvoiceStatus.VOID) {
            throw new BusinessRuleViolationException("Cannot record payment for " + invoice.getStatus() + " invoice");
        }

        BigDecimal newPaidAmount = invoice.getPaidAmount().add(amount);
        BigDecimal newBalance = invoice.getTotalAmount().subtract(newPaidAmount);

        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleViolationException("Payment amount exceeds balance");
        }

        invoice.setPaidAmount(newPaidAmount);
        invoice.setBalanceAmount(newBalance);

        if (newBalance.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
        } else {
            invoice.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }

        log.info("Payment of {} recorded for invoice {}", amount, invoice.getInvoiceNumber());
        return invoiceMapper.toResponse(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalOutstandingByCustomer(Long customerId) {
        BigDecimal total = invoiceRepository.getTotalOutstandingByCustomer(customerId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getOverdueInvoices() {
        List<Invoice> overdue = invoiceRepository.findByPaymentStatus(PaymentStatus.UNPAID);
        overdue.addAll(invoiceRepository.findByPaymentStatus(PaymentStatus.PARTIALLY_PAID));
        return invoiceMapper.toResponseList(
                overdue.stream()
                        .filter(i -> i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()))
                        .toList()
        );
    }
}
