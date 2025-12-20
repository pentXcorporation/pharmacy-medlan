package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.CreateRGRNRequest;
import com.pharmacy.medlan.dto.response.inventory.RGRNResponse;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.RGRNMapper;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.inventory.GRN;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.inventory.RGRN;
import com.pharmacy.medlan.model.inventory.RGRNLine;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.inventory.GRNRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.inventory.RGRNRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.supplier.SupplierRepository;
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
public class RGRNServiceImpl implements RGRNService {

    private final RGRNRepository rgrnRepository;
    private final GRNRepository grnRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final UserRepository userRepository;
    private final RGRNMapper rgrnMapper;

    @Override
    public RGRNResponse createRGRN(CreateRGRNRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        
        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        RGRN rgrn = RGRN.builder()
                .rgrnNumber(generateRgrnNumber())
                .supplier(supplier)
                .branch(branch)
                .returnDate(LocalDate.now())
                .returnReason(request.getReturnReason())
                .refundStatus(PaymentStatus.PENDING)
                .returnedBy(currentUser)
                .remarks(request.getRemarks())
                .build();

        if (request.getOriginalGrnId() != null) {
            GRN originalGrn = grnRepository.findById(request.getOriginalGrnId())
                    .orElseThrow(() -> new ResourceNotFoundException("Original GRN not found"));
            rgrn.setOriginalGrn(originalGrn);
        }

        BigDecimal totalReturnAmount = BigDecimal.ZERO;

        for (CreateRGRNRequest.RGRNLineRequest lineRequest : request.getLines()) {
            Product product = productRepository.findById(lineRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + lineRequest.getProductId()));

            BigDecimal lineTotal = lineRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(lineRequest.getQuantityReturned()));

            RGRNLine line = RGRNLine.builder()
                    .rgrn(rgrn)
                    .product(product)
                    .productName(product.getProductName())
                    .batchNumber(lineRequest.getBatchNumber())
                    .quantityReturned(lineRequest.getQuantityReturned())
                    .unitPrice(lineRequest.getUnitPrice())
                    .totalAmount(lineTotal)
                    .returnReason(lineRequest.getReturnReason())
                    .build();

            if (lineRequest.getInventoryBatchId() != null) {
                InventoryBatch batch = inventoryBatchRepository.findById(lineRequest.getInventoryBatchId())
                        .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found"));
                line.setInventoryBatch(batch);
            }

            // Deduct from inventory
            BranchInventory branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(product.getId(), branch.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch inventory not found for product: " + product.getProductName()));

            if (branchInventory.getQuantityAvailable() < lineRequest.getQuantityReturned()) {
                throw new IllegalStateException("Insufficient stock for return: " + product.getProductName());
            }

            branchInventory.setQuantityAvailable(branchInventory.getQuantityAvailable() - lineRequest.getQuantityReturned());
            branchInventory.setQuantityOnHand(branchInventory.getQuantityOnHand() - lineRequest.getQuantityReturned());
            branchInventoryRepository.save(branchInventory);

            rgrn.getRgrnLines().add(line);
            totalReturnAmount = totalReturnAmount.add(lineTotal);
        }

        rgrn.setTotalReturnAmount(totalReturnAmount);
        rgrn = rgrnRepository.save(rgrn);
        log.info("RGRN created: {}", rgrn.getRgrnNumber());

        return rgrnMapper.toResponse(rgrn);
    }

    @Override
    @Transactional(readOnly = true)
    public RGRNResponse getById(Long id) {
        RGRN rgrn = rgrnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RGRN not found"));
        return rgrnMapper.toResponse(rgrn);
    }

    @Override
    @Transactional(readOnly = true)
    public RGRNResponse getByRgrnNumber(String rgrnNumber) {
        RGRN rgrn = rgrnRepository.findByRgrnNumber(rgrnNumber)
                .orElseThrow(() -> new ResourceNotFoundException("RGRN not found"));
        return rgrnMapper.toResponse(rgrn);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RGRNResponse> getAllRGRNs(Pageable pageable) {
        return rgrnRepository.findAll(pageable).map(rgrnMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RGRNResponse> getBySupplier(Long supplierId) {
        return rgrnMapper.toResponseList(rgrnRepository.findBySupplierId(supplierId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RGRNResponse> getByBranch(Long branchId) {
        return rgrnMapper.toResponseList(rgrnRepository.findByBranchId(branchId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RGRNResponse> getByOriginalGrn(Long originalGrnId) {
        return rgrnMapper.toResponseList(rgrnRepository.findByOriginalGrnId(originalGrnId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RGRNResponse> getByRefundStatus(PaymentStatus refundStatus) {
        return rgrnMapper.toResponseList(rgrnRepository.findByRefundStatus(refundStatus));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RGRNResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return rgrnMapper.toResponseList(rgrnRepository.findByReturnDateBetween(startDate, endDate));
    }

    @Override
    public RGRNResponse updateRefundStatus(Long id, PaymentStatus refundStatus) {
        RGRN rgrn = rgrnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RGRN not found"));

        rgrn.setRefundStatus(refundStatus);
        rgrn = rgrnRepository.save(rgrn);
        log.info("RGRN {} refund status updated to {}", rgrn.getRgrnNumber(), refundStatus);

        return rgrnMapper.toResponse(rgrn);
    }

    @Override
    public void deleteRGRN(Long id) {
        RGRN rgrn = rgrnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RGRN not found"));

        if (rgrn.getRefundStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Cannot delete RGRN with completed refund");
        }

        // Restore inventory before deleting
        for (RGRNLine line : rgrn.getRgrnLines()) {
            BranchInventory branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(line.getProduct().getId(), rgrn.getBranch().getId())
                    .orElse(null);

            if (branchInventory != null) {
                branchInventory.setQuantityAvailable(branchInventory.getQuantityAvailable() + line.getQuantityReturned());
                branchInventory.setQuantityOnHand(branchInventory.getQuantityOnHand() + line.getQuantityReturned());
                branchInventoryRepository.save(branchInventory);
            }
        }

        rgrnRepository.delete(rgrn);
        log.info("RGRN deleted: {}", rgrn.getRgrnNumber());
    }

    @Override
    public String generateRgrnNumber() {
        long count = rgrnRepository.count() + 1;
        return String.format("RGRN-%d-%05d", Year.now().getValue(), count);
    }
}
