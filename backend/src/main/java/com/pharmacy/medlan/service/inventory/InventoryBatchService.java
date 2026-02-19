package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.model.product.InventoryBatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InventoryBatchService {

    InventoryBatch getById(Long id);

    List<InventoryBatch> getByProductAndBranch(Long productId, Long branchId);

    List<InventoryBatch> getAvailableBatchesByProductAndBranch(Long productId, Long branchId);

    List<InventoryBatch> getByBranch(Long branchId);

    InventoryBatch getByProductBranchAndBatchNumber(Long productId, Long branchId, String batchNumber);

    Page<InventoryBatch> getAllBatches(Pageable pageable);

    int getTotalAvailableQuantity(Long productId, Long branchId);

    InventoryBatch updateBatchQuantity(Long batchId, int quantityChange, String reason);

    void deactivateBatch(Long batchId);
}
