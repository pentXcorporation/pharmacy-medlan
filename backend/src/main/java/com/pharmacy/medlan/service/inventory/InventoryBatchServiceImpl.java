package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryBatchServiceImpl implements InventoryBatchService {

    private final InventoryBatchRepository inventoryBatchRepository;

    @Override
    public InventoryBatch getById(Long id) {
        return inventoryBatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found with id: " + id));
    }

    @Override
    public List<InventoryBatch> getByProductAndBranch(Long productId, Long branchId) {
        return inventoryBatchRepository.findByProductIdAndBranchId(productId, branchId);
    }

    @Override
    public List<InventoryBatch> getAvailableBatchesByProductAndBranch(Long productId, Long branchId) {
        return inventoryBatchRepository.findByProductIdAndBranchId(productId, branchId)
                .stream()
                .filter(b -> b.getIsActive() && !b.getIsExpired() && b.getQuantityAvailable() > 0)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryBatch> getByBranch(Long branchId) {
        return inventoryBatchRepository.findByBranchId(branchId);
    }

    @Override
    public InventoryBatch getByProductBranchAndBatchNumber(Long productId, Long branchId, String batchNumber) {
        return inventoryBatchRepository.findByProductIdAndBranchIdAndBatchNumber(productId, branchId, batchNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + batchNumber));
    }

    @Override
    public Page<InventoryBatch> getAllBatches(Pageable pageable) {
        return inventoryBatchRepository.findAll(pageable);
    }

    @Override
    public int getTotalAvailableQuantity(Long productId, Long branchId) {
        return getAvailableBatchesByProductAndBranch(productId, branchId)
                .stream()
                .mapToInt(InventoryBatch::getQuantityAvailable)
                .sum();
    }

    @Override
    @Transactional
    public InventoryBatch updateBatchQuantity(Long batchId, int quantityChange, String reason) {
        log.info("Updating batch {} quantity by {}: {}", batchId, quantityChange, reason);
        InventoryBatch batch = getById(batchId);

        int newQuantity = batch.getQuantityAvailable() + quantityChange;
        if (newQuantity < 0) {
            throw new BusinessRuleViolationException("Insufficient stock in batch. Available: " + batch.getQuantityAvailable());
        }

        batch.setQuantityAvailable(newQuantity);
        return inventoryBatchRepository.save(batch);
    }

    @Override
    @Transactional
    public void deactivateBatch(Long batchId) {
        InventoryBatch batch = getById(batchId);
        batch.setIsActive(false);
        inventoryBatchRepository.save(batch);
    }
}
