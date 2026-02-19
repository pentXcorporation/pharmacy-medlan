package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.inventory.StockTransferResponse;
import com.pharmacy.medlan.model.inventory.StockTransfer;
import com.pharmacy.medlan.model.inventory.StockTransferItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StockTransferMapper {

    public StockTransferResponse toResponse(StockTransfer stockTransfer) {
        if (stockTransfer == null) {
            return null;
        }

        return StockTransferResponse.builder()
                .id(stockTransfer.getId())
                .transferNumber(stockTransfer.getTransferNumber())
                .fromBranchId(stockTransfer.getFromBranch() != null ? stockTransfer.getFromBranch().getId() : null)
                .fromBranchName(stockTransfer.getFromBranch() != null ? stockTransfer.getFromBranch().getBranchName() : null)
                .toBranchId(stockTransfer.getToBranch() != null ? stockTransfer.getToBranch().getId() : null)
                .toBranchName(stockTransfer.getToBranch() != null ? stockTransfer.getToBranch().getBranchName() : null)
                .transferDate(stockTransfer.getTransferDate())
                .expectedReceiptDate(stockTransfer.getExpectedReceiptDate())
                .actualReceiptDate(stockTransfer.getActualReceiptDate())
                .status(stockTransfer.getStatus())
                .initiatedByName(stockTransfer.getInitiatedBy() != null ? stockTransfer.getInitiatedBy().getFullName() : null)
                .approvedByName(stockTransfer.getApprovedBy() != null ? stockTransfer.getApprovedBy().getFullName() : null)
                .approvedAt(stockTransfer.getApprovedAt())
                .receivedByName(stockTransfer.getReceivedBy() != null ? stockTransfer.getReceivedBy().getFullName() : null)
                .remarks(stockTransfer.getRemarks())
                .items(mapItems(stockTransfer.getItems()))
                .createdAt(stockTransfer.getCreatedAt())
                .updatedAt(stockTransfer.getUpdatedAt())
                .build();
    }

    public List<StockTransferResponse> toResponseList(List<StockTransfer> stockTransfers) {
        if (stockTransfers == null) {
            return Collections.emptyList();
        }
        return stockTransfers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private List<StockTransferResponse.StockTransferItemResponse> mapItems(List<StockTransferItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }
        return items.stream()
                .map(this::mapItem)
                .collect(Collectors.toList());
    }

    private StockTransferResponse.StockTransferItemResponse mapItem(StockTransferItem item) {
        if (item == null) {
            return null;
        }

        return StockTransferResponse.StockTransferItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getProductName() : null)
                .productSku(item.getProduct() != null ? item.getProduct().getProductCode() : null)
                .inventoryBatchId(item.getInventoryBatch() != null ? item.getInventoryBatch().getId() : null)
                .batchNumber(item.getInventoryBatch() != null ? item.getInventoryBatch().getBatchNumber() : null)
                .quantityTransferred(item.getQuantityTransferred())
                .quantityReceived(item.getQuantityReceived())
                .remarks(item.getRemarks())
                .build();
    }
}