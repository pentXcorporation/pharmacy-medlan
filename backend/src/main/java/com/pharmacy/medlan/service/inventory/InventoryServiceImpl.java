package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.response.inventory.InventoryBatchResponse;
import com.pharmacy.medlan.dto.response.inventory.InventoryResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.InventoryMapper;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryServiceImpl implements InventoryService {

    private final BranchInventoryRepository branchInventoryRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public InventoryResponse getInventoryByProductAndBranch(Long productId, Long branchId) {
        BranchInventory inventory = branchInventoryRepository
                .findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product and branch"));

        List<InventoryBatch> batches = inventoryBatchRepository
                .findByProductIdAndBranchId(productId, branchId);

        return inventoryMapper.toInventoryResponse(inventory, batches);
    }

    @Override
    public Page<InventoryResponse> getInventoryByBranch(Long branchId, Pageable pageable) {
        Page<BranchInventory> inventoryPage = branchInventoryRepository.findByBranchId(branchId, pageable);

        List<InventoryResponse> responses = inventoryPage.getContent().stream()
                .map(inv -> {
                    List<InventoryBatch> batches = inventoryBatchRepository
                            .findByProductIdAndBranchId(inv.getProduct().getId(), branchId);
                    return inventoryMapper.toInventoryResponse(inv, batches);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, inventoryPage.getTotalElements());
    }

    @Override
    public List<InventoryResponse> getLowStockInventory(Long branchId) {
        List<BranchInventory> lowStock = branchInventoryRepository.findLowStockByBranch(branchId);

        return lowStock.stream()
                .map(inv -> {
                    List<InventoryBatch> batches = inventoryBatchRepository
                            .findByProductIdAndBranchId(inv.getProduct().getId(), branchId);
                    return inventoryMapper.toInventoryResponse(inv, batches);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryResponse> getOutOfStockInventory(Long branchId) {
        List<BranchInventory> outOfStock = branchInventoryRepository.findOutOfStockByBranch(branchId);

        return outOfStock.stream()
                .map(inv -> {
                    List<InventoryBatch> batches = inventoryBatchRepository
                            .findByProductIdAndBranchId(inv.getProduct().getId(), branchId);
                    return inventoryMapper.toInventoryResponse(inv, batches);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryBatchResponse> getBatchesByProduct(Long productId, Long branchId) {
        List<InventoryBatch> batches = inventoryBatchRepository
                .findByProductIdAndBranchId(productId, branchId);
        return inventoryMapper.toBatchResponseList(batches);
    }

    @Override
    public List<InventoryBatchResponse> getExpiringBatches(Long branchId, LocalDate alertDate) {
        List<InventoryBatch> batches = inventoryBatchRepository
                .findExpiringBatchesForAlert(branchId, alertDate);
        return inventoryMapper.toBatchResponseList(batches);
    }

    @Override
    public List<InventoryBatchResponse> getExpiredBatches(Long branchId) {
        List<InventoryBatch> batches = inventoryBatchRepository.findExpiredBatches(LocalDate.now());
        return inventoryMapper.toBatchResponseList(
                batches.stream()
                        .filter(b -> b.getBranch().getId().equals(branchId))
                        .collect(Collectors.toList())
        );
    }

    @Override
    public Integer getAvailableQuantity(Long productId, Long branchId) {
        return branchInventoryRepository.findByProductIdAndBranchId(productId, branchId)
                .map(BranchInventory::getQuantityAvailable)
                .orElse(0);
    }
}
