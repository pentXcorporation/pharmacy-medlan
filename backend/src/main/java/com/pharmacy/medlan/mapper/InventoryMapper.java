package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.inventory.InventoryBatchResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryResponse;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class InventoryMapper {

    public InventoryBatchResponse toBatchResponse(InventoryBatch batch) {
        if (batch == null) {
            return null;
        }

        LocalDate today = LocalDate.now();
        boolean isExpired = batch.getExpiryDate() != null && batch.getExpiryDate().isBefore(today);
        int daysToExpiry = batch.getExpiryDate() != null ? 
                (int) ChronoUnit.DAYS.between(today, batch.getExpiryDate()) : 0;

        return InventoryBatchResponse.builder()
                .id(batch.getId())
                .productId(batch.getProduct() != null ? batch.getProduct().getId() : null)
                .productCode(batch.getProduct() != null ? batch.getProduct().getProductCode() : null)
                .productName(batch.getProduct() != null ? batch.getProduct().getProductName() : null)
                .branchId(batch.getBranch() != null ? batch.getBranch().getId() : null)
                .branchName(batch.getBranch() != null ? batch.getBranch().getBranchName() : null)
                .batchNumber(batch.getBatchNumber())
                .manufacturingDate(batch.getManufacturingDate())
                .expiryDate(batch.getExpiryDate())
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
        return batches.stream()
                .map(this::toBatchResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse toInventoryResponse(BranchInventory inventory, List<InventoryBatch> batches) {
        if (inventory == null) {
            return null;
        }

        String stockStatus = "IN_STOCK";
        if (inventory.getQuantityAvailable() <= 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (inventory.getQuantityAvailable() <= inventory.getReorderLevel()) {
            stockStatus = "LOW_STOCK";
        }

        return InventoryResponse.builder()
                .productId(inventory.getProduct() != null ? inventory.getProduct().getId() : null)
                .productCode(inventory.getProduct() != null ? inventory.getProduct().getProductCode() : null)
                .productName(inventory.getProduct() != null ? inventory.getProduct().getProductName() : null)
                .branchId(inventory.getBranch() != null ? inventory.getBranch().getId() : null)
                .branchName(inventory.getBranch() != null ? inventory.getBranch().getBranchName() : null)
                .totalQuantity(inventory.getQuantityAvailable())
                .minimumStock(inventory.getMinimumStock())
                .reorderLevel(inventory.getReorderLevel())
                .sellingPrice(inventory.getProduct() != null ? inventory.getProduct().getSellingPrice() : null)
                .stockStatus(stockStatus)
                .batches(toBatchResponseList(batches))
                .build();
    }
}
