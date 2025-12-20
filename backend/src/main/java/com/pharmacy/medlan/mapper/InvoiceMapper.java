package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.pos.InvoiceResponse;
import com.pharmacy.medlan.model.pos.Invoice;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(Invoice invoice) {
        if (invoice == null) {
            return null;
        }

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .customerId(invoice.getCustomer() != null ? invoice.getCustomer().getId() : null)
                .customerName(invoice.getCustomer() != null ? invoice.getCustomer().getCustomerName() : null)
                .branchId(invoice.getBranch() != null ? invoice.getBranch().getId() : null)
                .branchName(invoice.getBranch() != null ? invoice.getBranch().getBranchName() : null)
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .subtotal(invoice.getSubtotal())
                .discount(invoice.getDiscount())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .balanceAmount(invoice.getBalanceAmount())
                .status(invoice.getStatus())
                .paymentStatus(invoice.getPaymentStatus())
                .paymentType(invoice.getPaymentType())
                .chequeNumber(invoice.getChequeNumber())
                .chequeDate(invoice.getChequeDate())
                .createdAt(invoice.getCreatedAt())
                .build();
    }

    public List<InvoiceResponse> toResponseList(List<Invoice> invoices) {
        return invoices.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
