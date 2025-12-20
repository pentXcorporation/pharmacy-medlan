package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.ApproveStockTransferRequest;
import com.pharmacy.medlan.dto.request.inventory.CreateStockTransferRequest;
import com.pharmacy.medlan.dto.response.inventory.StockTransferResponse;
import com.pharmacy.medlan.enums.StockTransferStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.StockTransferMapper;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.inventory.StockTransfer;
import com.pharmacy.medlan.model.inventory.StockTransferItem;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.inventory.StockTransferRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class StockTransferServiceImpl implements StockTransferService {

    private final StockTransferRepository stockTransferRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final UserRepository userRepository;
    private final StockTransferMapper stockTransferMapper;

    @Override
    public StockTransferResponse createStockTransfer(CreateStockTransferRequest request) {
        Branch fromBranch = branchRepository.findById(request.getFromBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Source branch not found"));
        Branch toBranch = branchRepository.findById(request.getToBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination branch not found"));
        
        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        StockTransfer stockTransfer = StockTransfer.builder()
                .transferNumber(generateTransferNumber())
                .fromBranch(fromBranch)
                .toBranch(toBranch)
                .transferDate(LocalDate.now())
                .expectedReceiptDate(request.getExpectedReceiptDate())
                .status(StockTransferStatus.PENDING)
                .initiatedBy(currentUser)
                .remarks(request.getRemarks())
                .items(new ArrayList<>())
                .build();

        for (CreateStockTransferRequest.StockTransferItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            StockTransferItem item = StockTransferItem.builder()
                    .stockTransfer(stockTransfer)
                    .product(product)
                    .quantityTransferred(itemRequest.getQuantityTransferred())
                    .quantityReceived(0)
                    .remarks(itemRequest.getRemarks())
                    .build();

            if (itemRequest.getInventoryBatchId() != null) {
                InventoryBatch batch = inventoryBatchRepository.findById(itemRequest.getInventoryBatchId())
                        .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found"));
                item.setInventoryBatch(batch);
            }

            stockTransfer.getItems().add(item);
        }

        stockTransfer = stockTransferRepository.save(stockTransfer);
        log.info("Stock transfer created: {}", stockTransfer.getTransferNumber());

        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    @Transactional(readOnly = true)
    public StockTransferResponse getById(Long id) {
        StockTransfer stockTransfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));
        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    @Transactional(readOnly = true)
    public StockTransferResponse getByTransferNumber(String transferNumber) {
        StockTransfer stockTransfer = stockTransferRepository.findByTransferNumber(transferNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));
        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockTransferResponse> getAllStockTransfers(Pageable pageable) {
        return stockTransferRepository.findAll(pageable).map(stockTransferMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockTransferResponse> getByFromBranch(Long branchId) {
        return stockTransferMapper.toResponseList(stockTransferRepository.findByFromBranchId(branchId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockTransferResponse> getByToBranch(Long branchId) {
        return stockTransferMapper.toResponseList(stockTransferRepository.findByToBranchId(branchId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockTransferResponse> getByBranch(Long branchId) {
        List<StockTransfer> fromTransfers = stockTransferRepository.findByFromBranchId(branchId);
        List<StockTransfer> toTransfers = stockTransferRepository.findByToBranchId(branchId);
        List<StockTransfer> combined = new ArrayList<>(fromTransfers);
        combined.addAll(toTransfers);
        return stockTransferMapper.toResponseList(combined);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockTransferResponse> getByStatus(StockTransferStatus status) {
        return stockTransferMapper.toResponseList(stockTransferRepository.findByStatus(status));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockTransferResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return stockTransferMapper.toResponseList(stockTransferRepository.findByTransferDateBetween(startDate, endDate));
    }

    @Override
    public StockTransferResponse approveStockTransfer(Long id, ApproveStockTransferRequest request) {
        StockTransfer stockTransfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));

        if (stockTransfer.getStatus() != StockTransferStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transfers can be approved");
        }

        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        // Deduct from source branch inventory
        for (StockTransferItem item : stockTransfer.getItems()) {
            BranchInventory sourceInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(item.getProduct().getId(), stockTransfer.getFromBranch().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Source branch inventory not found for product: " + item.getProduct().getProductName()));

            if (sourceInventory.getQuantityAvailable() < item.getQuantityTransferred()) {
                throw new IllegalStateException("Insufficient stock in source branch for: " + item.getProduct().getProductName());
            }

            sourceInventory.setQuantityAvailable(sourceInventory.getQuantityAvailable() - item.getQuantityTransferred());
            sourceInventory.setQuantityAllocated(sourceInventory.getQuantityAllocated() + item.getQuantityTransferred());
            branchInventoryRepository.save(sourceInventory);
        }

        stockTransfer.setStatus(StockTransferStatus.APPROVED);
        stockTransfer.setApprovedBy(currentUser);
        stockTransfer.setApprovedAt(LocalDateTime.now());

        stockTransfer = stockTransferRepository.save(stockTransfer);
        log.info("Stock transfer approved: {}", stockTransfer.getTransferNumber());

        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    public StockTransferResponse receiveStockTransfer(Long id, Long receivedByUserId) {
        StockTransfer stockTransfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));

        if (stockTransfer.getStatus() != StockTransferStatus.IN_TRANSIT && 
            stockTransfer.getStatus() != StockTransferStatus.APPROVED) {
            throw new IllegalStateException("Only IN_TRANSIT or APPROVED transfers can be received");
        }

        User receivedByUser = userRepository.findById(receivedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Add to destination branch inventory, complete source deduction
        for (StockTransferItem item : stockTransfer.getItems()) {
            // Complete deduction from source
            BranchInventory sourceInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(item.getProduct().getId(), stockTransfer.getFromBranch().getId())
                    .orElse(null);

            if (sourceInventory != null) {
                sourceInventory.setQuantityAllocated(
                        Math.max(0, sourceInventory.getQuantityAllocated() - item.getQuantityTransferred()));
                sourceInventory.setQuantityOnHand(
                        Math.max(0, sourceInventory.getQuantityOnHand() - item.getQuantityTransferred()));
                branchInventoryRepository.save(sourceInventory);
            }

            // Add to destination
            BranchInventory destInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(item.getProduct().getId(), stockTransfer.getToBranch().getId())
                    .orElse(null);

            if (destInventory == null) {
                destInventory = BranchInventory.builder()
                        .product(item.getProduct())
                        .branch(stockTransfer.getToBranch())
                        .quantityOnHand(0)
                        .quantityAllocated(0)
                        .quantityAvailable(0)
                        .build();
            }

            destInventory.setQuantityOnHand(destInventory.getQuantityOnHand() + item.getQuantityTransferred());
            destInventory.setQuantityAvailable(destInventory.getQuantityAvailable() + item.getQuantityTransferred());
            branchInventoryRepository.save(destInventory);

            item.setQuantityReceived(item.getQuantityTransferred());
        }

        stockTransfer.setStatus(StockTransferStatus.RECEIVED);
        stockTransfer.setReceivedBy(receivedByUser);
        stockTransfer.setActualReceiptDate(LocalDate.now());

        stockTransfer = stockTransferRepository.save(stockTransfer);
        log.info("Stock transfer received: {}", stockTransfer.getTransferNumber());

        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    public StockTransferResponse rejectStockTransfer(Long id, String reason) {
        StockTransfer stockTransfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));

        if (stockTransfer.getStatus() != StockTransferStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transfers can be rejected");
        }

        stockTransfer.setStatus(StockTransferStatus.REJECTED);
        stockTransfer.setRemarks((stockTransfer.getRemarks() != null ? stockTransfer.getRemarks() + "\n" : "") + "Rejected: " + reason);

        stockTransfer = stockTransferRepository.save(stockTransfer);
        log.info("Stock transfer rejected: {}", stockTransfer.getTransferNumber());

        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    public StockTransferResponse cancelStockTransfer(Long id, String reason) {
        StockTransfer stockTransfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock transfer not found"));

        if (stockTransfer.getStatus() == StockTransferStatus.RECEIVED) {
            throw new IllegalStateException("Cannot cancel received transfers");
        }

        // Restore allocated inventory if it was approved
        if (stockTransfer.getStatus() == StockTransferStatus.APPROVED || 
            stockTransfer.getStatus() == StockTransferStatus.IN_TRANSIT) {
            for (StockTransferItem item : stockTransfer.getItems()) {
                BranchInventory sourceInventory = branchInventoryRepository
                        .findByProductIdAndBranchId(item.getProduct().getId(), stockTransfer.getFromBranch().getId())
                        .orElse(null);

                if (sourceInventory != null) {
                    sourceInventory.setQuantityAvailable(sourceInventory.getQuantityAvailable() + item.getQuantityTransferred());
                    sourceInventory.setQuantityAllocated(
                            Math.max(0, sourceInventory.getQuantityAllocated() - item.getQuantityTransferred()));
                    branchInventoryRepository.save(sourceInventory);
                }
            }
        }

        stockTransfer.setStatus(StockTransferStatus.CANCELLED);
        stockTransfer.setRemarks((stockTransfer.getRemarks() != null ? stockTransfer.getRemarks() + "\n" : "") + "Cancelled: " + reason);

        stockTransfer = stockTransferRepository.save(stockTransfer);
        log.info("Stock transfer cancelled: {}", stockTransfer.getTransferNumber());

        return stockTransferMapper.toResponse(stockTransfer);
    }

    @Override
    public String generateTransferNumber() {
        long count = stockTransferRepository.count() + 1;
        return String.format("ST-%d-%05d", Year.now().getValue(), count);
    }
}
