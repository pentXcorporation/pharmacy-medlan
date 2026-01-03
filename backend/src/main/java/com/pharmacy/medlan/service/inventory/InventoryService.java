package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.response.inventory.InventoryBatchResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {

    InventoryResponse getInventoryByProductAndBranch(Long productId, Long branchId);

    Page<InventoryResponse> getInventoryByBranch(Long branchId, Pageable pageable);

    List<InventoryResponse> getAllLowStockInventory();

    List<InventoryResponse> getAllOutOfStockInventory();

    List<InventoryResponse> getLowStockInventory(Long branchId);

    List<InventoryResponse> getOutOfStockInventory(Long branchId);

    List<InventoryBatchResponse> getBatchesByProduct(Long productId, Long branchId);

    List<InventoryBatchResponse> getExpiringBatches(Long branchId, LocalDate alertDate);

    List<InventoryBatchResponse> getExpiredBatches(Long branchId);

    Integer getAvailableQuantity(Long productId, Long branchId);
}
