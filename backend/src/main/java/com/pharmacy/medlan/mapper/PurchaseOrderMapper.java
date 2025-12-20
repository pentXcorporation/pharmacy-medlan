package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.supplier.PurchaseOrderResponse;
import com.pharmacy.medlan.model.supplier.PurchaseOrder;
import com.pharmacy.medlan.model.supplier.PurchaseOrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PurchaseOrderMapper {

    public PurchaseOrderResponse toResponse(PurchaseOrder po) {
        if (po == null) {
            return null;
        }

        return PurchaseOrderResponse.builder()
                .id(po.getId())
                .poNumber(po.getPoNumber())
                .supplierId(po.getSupplier().getId())
                .supplierName(po.getSupplier().getSupplierName())
                .branchId(po.getBranch().getId())
                .branchName(po.getBranch().getBranchName())
                .orderDate(po.getOrderDate())
                .expectedDeliveryDate(po.getExpectedDeliveryDate())
                .actualDeliveryDate(po.getActualDeliveryDate())
                .totalAmount(po.getTotalAmount())
                .discountAmount(po.getDiscountAmount())
                .taxAmount(po.getTaxAmount())
                .netAmount(po.getNetAmount())
                .status(po.getStatus())
                .createdByName(po.getCreatedByUser() != null ? po.getCreatedByUser().getFullName() : null)
                .approvedByName(po.getApprovedByUser() != null ? po.getApprovedByUser().getFullName() : null)
                .approvedAt(po.getApprovedAt())
                .remarks(po.getRemarks())
                .supplierReference(po.getSupplierReference())
                .items(po.getItems() != null ? 
                        po.getItems().stream()
                                .map(this::toItemResponse)
                                .collect(Collectors.toList()) : null)
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .build();
    }

    public PurchaseOrderResponse.PurchaseOrderItemResponse toItemResponse(PurchaseOrderItem item) {
        if (item == null) {
            return null;
        }

        return PurchaseOrderResponse.PurchaseOrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getProductName())
                .productSku(item.getProduct().getProductCode())
                .quantityOrdered(item.getQuantityOrdered())
                .quantityReceived(item.getQuantityReceived())
                .unitPrice(item.getUnitPrice())
                .discountPercent(item.getDiscountPercent())
                .discountAmount(item.getDiscountAmount())
                .gstRate(item.getGstRate())
                .gstAmount(item.getGstAmount())
                .totalAmount(item.getTotalAmount())
                .remarks(item.getRemarks())
                .build();
    }

    public List<PurchaseOrderResponse> toResponseList(List<PurchaseOrder> purchaseOrders) {
        if (purchaseOrders == null) {
            return null;
        }
        return purchaseOrders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
