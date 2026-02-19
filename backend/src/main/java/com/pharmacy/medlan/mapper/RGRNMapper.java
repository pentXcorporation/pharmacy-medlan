package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.inventory.RGRNResponse;
import com.pharmacy.medlan.model.inventory.RGRN;
import com.pharmacy.medlan.model.inventory.RGRNLine;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RGRNMapper {

    public RGRNResponse toResponse(RGRN rgrn) {
        if (rgrn == null) {
            return null;
        }

        return RGRNResponse.builder()
                .id(rgrn.getId())
                .rgrnNumber(rgrn.getRgrnNumber())
                .originalGrnId(rgrn.getOriginalGrn() != null ? rgrn.getOriginalGrn().getId() : null)
                .originalGrnNumber(rgrn.getOriginalGrn() != null ? rgrn.getOriginalGrn().getGrnNumber() : null)
                .supplierId(rgrn.getSupplier() != null ? rgrn.getSupplier().getId() : null)
                .supplierName(rgrn.getSupplier() != null ? rgrn.getSupplier().getSupplierName() : null)
                .branchId(rgrn.getBranch() != null ? rgrn.getBranch().getId() : null)
                .branchName(rgrn.getBranch() != null ? rgrn.getBranch().getBranchName() : null)
                .returnDate(rgrn.getReturnDate())
                .totalReturnAmount(rgrn.getTotalReturnAmount())
                .refundStatus(rgrn.getRefundStatus())
                .returnReason(rgrn.getReturnReason())
                .returnedByName(rgrn.getReturnedBy() != null ? rgrn.getReturnedBy().getFullName() : null)
                .remarks(rgrn.getRemarks())
                .lines(rgrn.getRgrnLines() != null
                        ? rgrn.getRgrnLines().stream().map(this::toLineResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .createdAt(rgrn.getCreatedAt())
                .updatedAt(rgrn.getUpdatedAt())
                .build();
    }

    public RGRNResponse.RGRNLineResponse toLineResponse(RGRNLine line) {
        if (line == null) {
            return null;
        }

        // Prefer denormalized productName; fall back to the associated entity
        String productName = line.getProductName() != null
                ? line.getProductName()
                : (line.getProduct() != null ? line.getProduct().getProductName() : null);

        return RGRNResponse.RGRNLineResponse.builder()
                .id(line.getId())
                .productId(line.getProduct() != null ? line.getProduct().getId() : null)
                .productName(productName)
                .inventoryBatchId(line.getInventoryBatch() != null ? line.getInventoryBatch().getId() : null)
                .batchNumber(line.getBatchNumber())
                .quantityReturned(line.getQuantityReturned())
                .unitPrice(line.getUnitPrice())
                .totalAmount(line.getTotalAmount())
                .returnReason(line.getReturnReason())
                .build();
    }

    public List<RGRNResponse> toResponseList(List<RGRN> rgrns) {
        if (rgrns == null) {
            return Collections.emptyList();
        }
        return rgrns.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}