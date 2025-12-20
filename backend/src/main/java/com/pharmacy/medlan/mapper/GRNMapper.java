package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.inventory.GRNResponse;
import com.pharmacy.medlan.model.inventory.GRN;
import com.pharmacy.medlan.model.inventory.GRNLine;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GRNMapper {

    public GRNResponse toResponse(GRN grn) {
        if (grn == null) {
            return null;
        }

        return GRNResponse.builder()
                .id(grn.getId())
                .grnNumber(grn.getGrnNumber())
                .purchaseOrderId(grn.getPurchaseOrder() != null ? grn.getPurchaseOrder().getId() : null)
                .purchaseOrderNumber(grn.getPurchaseOrder() != null ? grn.getPurchaseOrder().getPoNumber() : null)
                .supplierId(grn.getSupplier() != null ? grn.getSupplier().getId() : null)
                .supplierName(grn.getSupplier() != null ? grn.getSupplier().getSupplierName() : null)
                .branchId(grn.getBranch() != null ? grn.getBranch().getId() : null)
                .branchName(grn.getBranch() != null ? grn.getBranch().getBranchName() : null)
                .receivedDate(grn.getReceivedDate())
                .supplierInvoiceNumber(grn.getSupplierInvoiceNumber())
                .supplierInvoiceDate(grn.getSupplierInvoiceDate())
                .totalAmount(grn.getTotalAmount())
                .discountAmount(grn.getDiscountAmount())
                .taxAmount(grn.getTaxAmount())
                .netAmount(grn.getNetAmount())
                .status(grn.getStatus())
                .remarks(grn.getRemarks())
                .receivedByUserName(grn.getReceivedBy() != null ? grn.getReceivedBy().getUsername() : null)
                .approvedByUserName(grn.getApprovedBy() != null ? grn.getApprovedBy().getUsername() : null)
                .approvedAt(grn.getApprovedAt())
                .paidAmount(grn.getPaidAmount())
                .balanceAmount(grn.getBalanceAmount())
                .paymentStatus(grn.getPaymentStatus())
                .items(toLineResponses(grn.getGrnLines()))
                .createdAt(grn.getCreatedAt())
                .build();
    }

    public List<GRNResponse> toResponseList(List<GRN> grns) {
        return grns.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GRNResponse.GRNLineResponse toLineResponse(GRNLine line) {
        if (line == null) {
            return null;
        }

        return GRNResponse.GRNLineResponse.builder()
                .id(line.getId())
                .productId(line.getProduct() != null ? line.getProduct().getId() : null)
                .productName(line.getProduct() != null ? line.getProduct().getProductName() : null)
                .productCode(line.getProduct() != null ? line.getProduct().getProductCode() : null)
                .batchNumber(line.getBatchNumber())
                .quantity(line.getQuantityReceived())
                .costPrice(line.getUnitPrice())
                .sellingPrice(line.getSellingPrice())
                .manufacturingDate(line.getManufacturingDate())
                .expiryDate(line.getExpiryDate())
                .discountAmount(line.getDiscountAmount())
                .totalAmount(line.getTotalAmount())
                .build();
    }

    public List<GRNResponse.GRNLineResponse> toLineResponses(List<GRNLine> lines) {
        if (lines == null) {
            return List.of();
        }
        return lines.stream()
                .map(this::toLineResponse)
                .collect(Collectors.toList());
    }
}
