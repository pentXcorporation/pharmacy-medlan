package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.pos.SaleItemResponse;
import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.model.pos.SaleItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SaleMapper {

    public SaleResponse toResponse(Sale sale) {
        if (sale == null) {
            return null;
        }

        return SaleResponse.builder()
                .id(sale.getId())
                .saleNumber(sale.getSaleNumber())
                .invoiceId(sale.getInvoice() != null ? sale.getInvoice().getId() : null)
                .invoiceNumber(sale.getInvoice() != null ? sale.getInvoice().getInvoiceNumber() : null)
                .branchId(sale.getBranch() != null ? sale.getBranch().getId() : null)
                .branchName(sale.getBranch() != null ? sale.getBranch().getBranchName() : null)
                .customerId(sale.getCustomer() != null ? sale.getCustomer().getId() : null)
                .customerName(sale.getCustomer() != null ? sale.getCustomer().getCustomerName() : null)
                .saleDate(sale.getSaleDate())
                .subtotal(sale.getSubtotal())
                .discountAmount(sale.getDiscountAmount())
                .discountPercent(sale.getDiscountPercent())
                .taxAmount(sale.getTaxAmount())
                .totalAmount(sale.getTotalAmount())
                .paidAmount(sale.getPaidAmount())
                .changeAmount(sale.getChangeAmount())
                .paymentMethod(sale.getPaymentMethod())
                .status(sale.getStatus())
                .soldByUserName(sale.getSoldBy() != null ? sale.getSoldBy().getUsername() : null)
                .patientName(sale.getPatientName())
                .doctorName(sale.getDoctorName())
                .remarks(sale.getRemarks())
                .items(toSaleItemResponses(sale.getSaleItems()))
                .createdAt(sale.getCreatedAt())
                .build();
    }

    public List<SaleResponse> toResponseList(List<Sale> sales) {
        return sales.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SaleItemResponse toSaleItemResponse(SaleItem item) {
        if (item == null) {
            return null;
        }

        return SaleItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productCode(item.getProduct() != null ? item.getProduct().getProductCode() : null)
                .inventoryBatchId(item.getInventoryBatch() != null ? item.getInventoryBatch().getId() : null)
                .batchNumber(item.getBatchNumber())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .discountAmount(item.getDiscountAmount())
                .taxAmount(item.getTaxAmount())
                .totalAmount(item.getTotalAmount())
                .costPrice(item.getCostPrice())
                .profit(item.getProfit())
                .build();
    }

    public List<SaleItemResponse> toSaleItemResponses(List<SaleItem> items) {
        if (items == null) {
            return List.of();
        }
        return items.stream()
                .map(this::toSaleItemResponse)
                .collect(Collectors.toList());
    }
}
