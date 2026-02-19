package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.inventory.InventoryBatchResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryResponse;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class InventoryMapper {

    public InventoryBatchResponse toBatchResponse(InventoryBatch batch) {
        if (batch == null) {
            return null;
        }

        LocalDate today = LocalDate.now();
        LocalDate expiryDate = batch.getExpiryDate();
        boolean isExpired = expiryDate != null && expiryDate.isBefore(today);
        // Negative when expired; callers can use isExpired flag to interpret sign
        int daysToExpiry = expiryDate != null ? (int) ChronoUnit.DAYS.between(today, expiryDate) : Integer.MAX_VALUE;

        return InventoryBatchResponse.builder()
                .id(batch.getId())
                .productId(batch.getProduct() != null ? batch.getProduct().getId() : null)
                .productCode(batch.getProduct() != null ? batch.getProduct().getProductCode() : null)
                .productName(batch.getProduct() != null ? batch.getProduct().getProductName() : null)
                .branchId(batch.getBranch() != null ? batch.getBranch().getId() : null)
                .branchName(batch.getBranch() != null ? batch.getBranch().getBranchName() : null)
                .batchNumber(batch.getBatchNumber())
                .manufacturingDate(batch.getManufacturingDate())
                .expiryDate(expiryDate)
                .quantityReceived(batch.getQuantityReceived())
                .quantityAvailable(batch.getQuantityAvailable())
                .quantitySold(batch.getQuantitySold())
                .costPrice(batch.getPurchasePrice())
                .sellingPrice(batch.getSellingPrice())
                .isActive(batch.getIsActive())
                .isExpired(isExpired)
                .daysToExpiry(daysToExpiry)
                .createdAt(batch.getCreatedAt())
                .build();
    }

    public List<InventoryBatchResponse> toBatchResponseList(List<InventoryBatch> batches) {
        if (batches == null) {
            return Collections.emptyList();
        }
        return batches.stream()
                .map(this::toBatchResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse toInventoryResponse(BranchInventory inventory, List<InventoryBatch> batches) {
        if (inventory == null) {
            return null;
        }

        int qty = inventory.getQuantityAvailable();
        String stockStatus;
        if (qty <= 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (qty <= inventory.getReorderLevel()) {
            stockStatus = "LOW_STOCK";
        } else {
            stockStatus = "IN_STOCK";
        }

        return InventoryResponse.builder()
                .productId(inventory.getProduct() != null ? inventory.getProduct().getId() : null)
                .productCode(inventory.getProduct() != null ? inventory.getProduct().getProductCode() : null)
                .productName(inventory.getProduct() != null ? inventory.getProduct().getProductName() : null)
                .branchId(inventory.getBranch() != null ? inventory.getBranch().getId() : null)
                .branchName(inventory.getBranch() != null ? inventory.getBranch().getBranchName() : null)
                .totalQuantity(qty)
                .quantityAvailable(qty)
                .quantityOnHand(inventory.getQuantityOnHand())
                .quantityAllocated(inventory.getQuantityAllocated())
                .minimumStock(inventory.getMinimumStock())
                .reorderLevel(inventory.getReorderLevel())
                .sellingPrice(inventory.getProduct() != null ? inventory.getProduct().getSellingPrice() : null)
                .stockStatus(stockStatus)
                .batches(toBatchResponseList(batches))
                .build();
    }
}