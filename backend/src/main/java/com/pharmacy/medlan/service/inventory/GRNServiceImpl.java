package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.CreateGRNRequest;
import com.pharmacy.medlan.dto.response.inventory.GRNResponse;
import com.pharmacy.medlan.enums.GRNStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.GRNMapper;
import com.pharmacy.medlan.model.inventory.GRN;
import com.pharmacy.medlan.model.inventory.GRNLine;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.supplier.PurchaseOrder;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.inventory.GRNRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.supplier.PurchaseOrderRepository;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GRNServiceImpl implements GRNService {

    private final GRNRepository grnRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final UserRepository userRepository;
    private final GRNMapper grnMapper;

    @Override
    public GRNResponse createGRN(CreateGRNRequest request) {
        log.info("Creating new GRN for supplier: {}", request.getSupplierId());

        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

        PurchaseOrder purchaseOrder = null;
        if (request.getPurchaseOrderId() != null) {
            purchaseOrder = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder not found with id: " + request.getPurchaseOrderId()));
        }

        GRN grn = GRN.builder()
                .grnNumber(generateGRNNumber())
                .purchaseOrder(purchaseOrder)
                .supplier(supplier)
                .branch(branch)
                .receivedDate(request.getReceivedDate())
                .supplierInvoiceNumber(request.getSupplierInvoiceNumber())
                .supplierInvoiceDate(request.getSupplierInvoiceDate())
                .status(GRNStatus.DRAFT)
                .paymentStatus(PaymentStatus.UNPAID)
                .remarks(request.getRemarks())
                .receivedBy(currentUser)
                .grnLines(new ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .netAmount(BigDecimal.ZERO)
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;

        for (CreateGRNRequest.GRNLineRequest lineRequest : request.getItems()) {
            Product product = productRepository.findById(lineRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + lineRequest.getProductId()));

            BigDecimal lineTotal = lineRequest.getCostPrice()
                    .multiply(BigDecimal.valueOf(lineRequest.getQuantity()));
            BigDecimal lineDiscount = lineRequest.getDiscountAmount() != null ? 
                    lineRequest.getDiscountAmount() : BigDecimal.ZERO;

            GRNLine grnLine = GRNLine.builder()
                    .grn(grn)
                    .product(product)
                    .batchNumber(lineRequest.getBatchNumber())
                    .manufacturingDate(lineRequest.getManufacturingDate())
                    .expiryDate(lineRequest.getExpiryDate())
                    .quantityReceived(lineRequest.getQuantity())
                    .freeQuantity(0)
                    .unitPrice(lineRequest.getCostPrice())
                    .discountAmount(lineDiscount)
                    .discountPercent(BigDecimal.ZERO)
                    .gstRate(BigDecimal.ZERO)
                    .gstAmount(BigDecimal.ZERO)
                    .totalAmount(lineTotal.subtract(lineDiscount))
                    .sellingPrice(lineRequest.getSellingPrice())
                    .build();

            grn.getGrnLines().add(grnLine);
            totalAmount = totalAmount.add(lineTotal);
            totalDiscount = totalDiscount.add(lineDiscount);
        }

        grn.setTotalAmount(totalAmount);
        grn.setDiscountAmount(totalDiscount);
        grn.setNetAmount(totalAmount.subtract(totalDiscount));
        grn.setBalanceAmount(totalAmount.subtract(totalDiscount));

        GRN savedGRN = grnRepository.save(grn);
        log.info("GRN created successfully with number: {}", savedGRN.getGrnNumber());

        return grnMapper.toResponse(savedGRN);
    }

    @Override
    @Transactional(readOnly = true)
    public GRNResponse getGRNById(Long id) {
        GRN grn = grnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + id));
        return grnMapper.toResponse(grn);
    }

    @Override
    @Transactional(readOnly = true)
    public GRNResponse getGRNByNumber(String grnNumber) {
        GRN grn = grnRepository.findByGrnNumber(grnNumber)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with number: " + grnNumber));
        return grnMapper.toResponse(grn);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GRNResponse> getAllGRNs(Pageable pageable) {
        return grnRepository.findAll(pageable).map(grnMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GRNResponse> getGRNsByBranch(Long branchId, Pageable pageable) {
        return grnRepository.findAll(pageable).map(grnMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GRNResponse> getGRNsBySupplier(Long supplierId, Pageable pageable) {
        return grnRepository.findAll(pageable).map(grnMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GRNResponse> getGRNsByDateRange(LocalDate startDate, LocalDate endDate) {
        return grnMapper.toResponseList(grnRepository.findByReceivedDateBetween(startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GRNResponse> getGRNsByStatus(GRNStatus status, Pageable pageable) {
        return grnRepository.findAll(pageable).map(grnMapper::toResponse);
    }

    @Override
    public GRNResponse approveGRN(Long id) {
        GRN grn = grnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + id));

        if (grn.getStatus() != GRNStatus.DRAFT && grn.getStatus() != GRNStatus.PENDING_APPROVAL) {
            throw new BusinessRuleViolationException("Only DRAFT or PENDING_APPROVAL GRN can be approved");
        }

        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        // Create inventory batches
        for (GRNLine line : grn.getGrnLines()) {
            InventoryBatch batch = InventoryBatch.builder()
                    .product(line.getProduct())
                    .branch(grn.getBranch())
                    .batchNumber(line.getBatchNumber())
                    .manufacturingDate(line.getManufacturingDate())
                    .expiryDate(line.getExpiryDate())
                    .quantityReceived(line.getQuantityReceived())
                    .quantityAvailable(line.getQuantityReceived())
                    .quantitySold(0)
                    .purchasePrice(line.getUnitPrice())
                    .sellingPrice(line.getSellingPrice())
                    .mrp(line.getMrp())
                    .isActive(true)
                    .isExpired(false)
                    .grnLine(line)
                    .build();
            inventoryBatchRepository.save(batch);
        }

        grn.setStatus(GRNStatus.RECEIVED);
        grn.setApprovedBy(currentUser);
        grn.setApprovedAt(LocalDateTime.now());

        log.info("GRN {} approved by {}", grn.getGrnNumber(), currentUser != null ? currentUser.getUsername() : "system");
        return grnMapper.toResponse(grnRepository.save(grn));
    }

    @Override
    public GRNResponse rejectGRN(Long id, String reason) {
        GRN grn = grnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + id));

        if (grn.getStatus() != GRNStatus.DRAFT && grn.getStatus() != GRNStatus.PENDING_APPROVAL) {
            throw new BusinessRuleViolationException("Only DRAFT or PENDING_APPROVAL GRN can be rejected");
        }

        grn.setStatus(GRNStatus.REJECTED);
        grn.setRemarks((grn.getRemarks() != null ? grn.getRemarks() + "\n" : "") + "Rejected: " + reason);

        return grnMapper.toResponse(grnRepository.save(grn));
    }

    @Override
    public GRNResponse cancelGRN(Long id, String reason) {
        GRN grn = grnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GRN not found with id: " + id));

        if (grn.getStatus() == GRNStatus.RECEIVED) {
            throw new BusinessRuleViolationException("Cannot cancel received GRN. Use Return GRN instead.");
        }

        grn.setStatus(GRNStatus.CANCELLED);
        grn.setRemarks((grn.getRemarks() != null ? grn.getRemarks() + "\n" : "") + "Cancelled: " + reason);

        return grnMapper.toResponse(grnRepository.save(grn));
    }

    @Override
    public String generateGRNNumber() {
        String prefix = "GRN-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-";
        Long count = grnRepository.count() + 1;
        return prefix + String.format("%05d", count);
    }
}
