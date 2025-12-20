package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateSaleReturnRequest;
import com.pharmacy.medlan.dto.response.pos.SaleReturnResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.SaleReturnMapper;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.pos.*;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import com.pharmacy.medlan.repository.pos.SaleItemRepository;
import com.pharmacy.medlan.repository.pos.SaleRepository;
import com.pharmacy.medlan.repository.pos.SaleReturnRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SaleReturnServiceImpl implements SaleReturnService {

    private final SaleReturnRepository saleReturnRepository;
    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final BranchRepository branchRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final UserRepository userRepository;
    private final SaleReturnMapper saleReturnMapper;

    @Override
    public SaleReturnResponse createSaleReturn(CreateSaleReturnRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        
        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        SaleReturn saleReturn = SaleReturn.builder()
                .returnNumber(generateReturnNumber())
                .branch(branch)
                .returnDate(LocalDate.now())
                .returnReason(request.getReturnReason())
                .processedBy(currentUser)
                .build();

        if (request.getOriginalSaleId() != null) {
            Sale originalSale = saleRepository.findById(request.getOriginalSaleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Original sale not found"));
            saleReturn.setOriginalSale(originalSale);
            saleReturn.setCustomer(originalSale.getCustomer());
        } else if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            saleReturn.setCustomer(customer);
        }

        BigDecimal totalReturnAmount = BigDecimal.ZERO;

        for (CreateSaleReturnRequest.SaleReturnItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            BigDecimal lineTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantityReturned()));

            SaleReturnItem item = SaleReturnItem.builder()
                    .saleReturn(saleReturn)
                    .product(product)
                    .quantityReturned(itemRequest.getQuantityReturned())
                    .unitPrice(itemRequest.getUnitPrice())
                    .totalAmount(lineTotal)
                    .returnReason(itemRequest.getReturnReason())
                    .build();

            if (itemRequest.getOriginalSaleItemId() != null) {
                SaleItem originalSaleItem = saleItemRepository.findById(itemRequest.getOriginalSaleItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("Original sale item not found"));
                item.setOriginalSaleItem(originalSaleItem);
            }

            if (itemRequest.getInventoryBatchId() != null) {
                InventoryBatch batch = inventoryBatchRepository.findById(itemRequest.getInventoryBatchId())
                        .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found"));
                item.setInventoryBatch(batch);
            }

            // Restore inventory
            BranchInventory branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(product.getId(), branch.getId())
                    .orElse(null);

            if (branchInventory == null) {
                branchInventory = BranchInventory.builder()
                        .product(product)
                        .branch(branch)
                        .quantityOnHand(0)
                        .quantityAllocated(0)
                        .quantityAvailable(0)
                        .build();
            }

            branchInventory.setQuantityOnHand(branchInventory.getQuantityOnHand() + itemRequest.getQuantityReturned());
            branchInventory.setQuantityAvailable(branchInventory.getQuantityAvailable() + itemRequest.getQuantityReturned());
            branchInventoryRepository.save(branchInventory);

            saleReturn.getReturnItems().add(item);
            totalReturnAmount = totalReturnAmount.add(lineTotal);
        }

        saleReturn.setTotalReturnAmount(totalReturnAmount);
        saleReturn.setRefundAmount(totalReturnAmount); // Default to full refund
        
        saleReturn = saleReturnRepository.save(saleReturn);
        log.info("Sale return created: {}", saleReturn.getReturnNumber());

        return saleReturnMapper.toResponse(saleReturn);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleReturnResponse getById(Long id) {
        SaleReturn saleReturn = saleReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale return not found"));
        return saleReturnMapper.toResponse(saleReturn);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleReturnResponse getByReturnNumber(String returnNumber) {
        SaleReturn saleReturn = saleReturnRepository.findByReturnNumber(returnNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sale return not found"));
        return saleReturnMapper.toResponse(saleReturn);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReturnResponse> getAllSaleReturns(Pageable pageable) {
        return saleReturnRepository.findAll(pageable).map(saleReturnMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleReturnResponse> getByBranch(Long branchId) {
        return saleReturnMapper.toResponseList(saleReturnRepository.findByBranchId(branchId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleReturnResponse> getByCustomer(Long customerId) {
        return saleReturnMapper.toResponseList(saleReturnRepository.findByCustomerId(customerId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleReturnResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return saleReturnMapper.toResponseList(saleReturnRepository.findByReturnDateBetween(startDate, endDate));
    }

    @Override
    public void deleteSaleReturn(Long id) {
        SaleReturn saleReturn = saleReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale return not found"));

        // Reverse inventory restoration
        for (SaleReturnItem item : saleReturn.getReturnItems()) {
            BranchInventory branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(item.getProduct().getId(), saleReturn.getBranch().getId())
                    .orElse(null);

            if (branchInventory != null) {
                branchInventory.setQuantityOnHand(
                        Math.max(0, branchInventory.getQuantityOnHand() - item.getQuantityReturned()));
                branchInventory.setQuantityAvailable(
                        Math.max(0, branchInventory.getQuantityAvailable() - item.getQuantityReturned()));
                branchInventoryRepository.save(branchInventory);
            }
        }

        saleReturnRepository.delete(saleReturn);
        log.info("Sale return deleted: {}", saleReturn.getReturnNumber());
    }

    @Override
    public String generateReturnNumber() {
        long count = saleReturnRepository.count() + 1;
        return String.format("SR-%d-%05d", Year.now().getValue(), count);
    }
}
