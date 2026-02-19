package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.pos.SaleReturnResponse;
import com.pharmacy.medlan.model.pos.SaleReturn;
import com.pharmacy.medlan.model.pos.SaleReturnItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SaleReturnMapper {

    public SaleReturnResponse toResponse(SaleReturn saleReturn) {
        if (saleReturn == null) {
            return null;
        }

        return SaleReturnResponse.builder()
                .id(saleReturn.getId())
                .returnNumber(saleReturn.getReturnNumber())
                .originalSaleId(saleReturn.getOriginalSale() != null ? saleReturn.getOriginalSale().getId() : null)
                .originalSaleNumber(saleReturn.getOriginalSale() != null ? saleReturn.getOriginalSale().getSaleNumber() : null)
                .branchId(saleReturn.getBranch() != null ? saleReturn.getBranch().getId() : null)
                .branchName(saleReturn.getBranch() != null ? saleReturn.getBranch().getBranchName() : null)
                .customerId(saleReturn.getCustomer() != null ? saleReturn.getCustomer().getId() : null)
                .customerName(saleReturn.getCustomer() != null ? saleReturn.getCustomer().getCustomerName() : null)
                .returnDate(saleReturn.getReturnDate())
                .totalReturnAmount(saleReturn.getTotalReturnAmount())
                .refundAmount(saleReturn.getRefundAmount())
                .returnReason(saleReturn.getReturnReason())
                .processedByName(saleReturn.getProcessedBy() != null ? saleReturn.getProcessedBy().getFullName() : null)
                .items(saleReturn.getReturnItems() != null
                        ? saleReturn.getReturnItems().stream().map(this::toItemResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .createdAt(saleReturn.getCreatedAt())
                .updatedAt(saleReturn.getUpdatedAt())
                .build();
    }

    public SaleReturnResponse.SaleReturnItemResponse toItemResponse(SaleReturnItem item) {
        if (item == null) {
            return null;
        }

        return SaleReturnResponse.SaleReturnItemResponse.builder()
                .id(item.getId())
                .originalSaleItemId(item.getOriginalSaleItem() != null ? item.getOriginalSaleItem().getId() : null)
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getProductName() : null)
                .productSku(item.getProduct() != null ? item.getProduct().getProductCode() : null)
                .inventoryBatchId(item.getInventoryBatch() != null ? item.getInventoryBatch().getId() : null)
                .batchNumber(item.getInventoryBatch() != null ? item.getInventoryBatch().getBatchNumber() : null)
                .quantityReturned(item.getQuantityReturned())
                .unitPrice(item.getUnitPrice())
                .totalAmount(item.getTotalAmount())
                .returnReason(item.getReturnReason())
                .build();
    }

    public List<SaleReturnResponse> toResponseList(List<SaleReturn> saleReturns) {
        if (saleReturns == null) {
            return Collections.emptyList();
        }
        return saleReturns.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}