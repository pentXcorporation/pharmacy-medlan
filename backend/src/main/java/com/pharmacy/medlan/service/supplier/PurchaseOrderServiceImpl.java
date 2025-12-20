package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.dto.request.supplier.CreatePurchaseOrderRequest;
import com.pharmacy.medlan.dto.response.supplier.PurchaseOrderResponse;
import com.pharmacy.medlan.enums.PurchaseOrderStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.PurchaseOrderMapper;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.supplier.PurchaseOrder;
import com.pharmacy.medlan.model.supplier.PurchaseOrderItem;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PurchaseOrderMapper purchaseOrderMapper;

    @Override
    public PurchaseOrderResponse createPurchaseOrder(CreatePurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        PurchaseOrder po = PurchaseOrder.builder()
                .poNumber(generatePoNumber())
                .supplier(supplier)
                .branch(branch)
                .orderDate(LocalDate.now())
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .status(PurchaseOrderStatus.DRAFT)
                .createdByUser(currentUser)
                .remarks(request.getRemarks())
                .supplierReference(request.getSupplierReference())
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (CreatePurchaseOrderRequest.PurchaseOrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            BigDecimal lineAmount = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantityOrdered()));
            
            BigDecimal discountPercent = itemRequest.getDiscountPercent() != null ? 
                    itemRequest.getDiscountPercent() : BigDecimal.ZERO;
            BigDecimal discountAmount = lineAmount.multiply(discountPercent)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            
            BigDecimal afterDiscount = lineAmount.subtract(discountAmount);
            BigDecimal gstAmount = afterDiscount.multiply(itemRequest.getGstRate())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = afterDiscount.add(gstAmount);

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(po)
                    .product(product)
                    .quantityOrdered(itemRequest.getQuantityOrdered())
                    .quantityReceived(0)
                    .unitPrice(itemRequest.getUnitPrice())
                    .discountPercent(discountPercent)
                    .discountAmount(discountAmount)
                    .gstRate(itemRequest.getGstRate())
                    .gstAmount(gstAmount)
                    .totalAmount(itemTotal)
                    .remarks(itemRequest.getRemarks())
                    .build();

            po.getItems().add(item);
            totalAmount = totalAmount.add(lineAmount);
            totalTax = totalTax.add(gstAmount);
        }

        po.setTotalAmount(totalAmount);
        po.setTaxAmount(totalTax);
        po.setNetAmount(totalAmount.subtract(po.getDiscountAmount()).add(totalTax));

        po = purchaseOrderRepository.save(po);
        log.info("Purchase order created: {}", po.getPoNumber());

        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));
        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getByPoNumber(String poNumber) {
        PurchaseOrder po = purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));
        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getAllPurchaseOrders(Pageable pageable) {
        return purchaseOrderRepository.findAll(pageable).map(purchaseOrderMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getBySupplier(Long supplierId) {
        return purchaseOrderMapper.toResponseList(purchaseOrderRepository.findBySupplierId(supplierId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getByBranch(Long branchId) {
        return purchaseOrderMapper.toResponseList(purchaseOrderRepository.findByBranchId(branchId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getByStatus(PurchaseOrderStatus status) {
        return purchaseOrderMapper.toResponseList(purchaseOrderRepository.findByStatus(status));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return purchaseOrderMapper.toResponseList(purchaseOrderRepository.findByOrderDateBetween(startDate, endDate));
    }

    @Override
    public PurchaseOrderResponse updateStatus(Long id, PurchaseOrderStatus status) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        po.setStatus(status);
        po = purchaseOrderRepository.save(po);
        log.info("Purchase order {} status updated to {}", po.getPoNumber(), status);

        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    public PurchaseOrderResponse approvePurchaseOrder(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT && po.getStatus() != PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only draft or pending approval orders can be approved");
        }

        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        po.setStatus(PurchaseOrderStatus.APPROVED);
        po.setApprovedByUser(currentUser);
        po.setApprovedAt(LocalDateTime.now());

        po = purchaseOrderRepository.save(po);
        log.info("Purchase order approved: {}", po.getPoNumber());

        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    public PurchaseOrderResponse rejectPurchaseOrder(Long id, String reason) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        if (po.getStatus() != PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only pending approval orders can be rejected");
        }

        po.setStatus(PurchaseOrderStatus.CANCELLED);
        po.setRemarks(po.getRemarks() + "\nRejection reason: " + reason);

        po = purchaseOrderRepository.save(po);
        log.info("Purchase order rejected: {}", po.getPoNumber());

        return purchaseOrderMapper.toResponse(po);
    }

    @Override
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new IllegalStateException("Only draft orders can be deleted");
        }

        purchaseOrderRepository.delete(po);
        log.info("Purchase order deleted: {}", po.getPoNumber());
    }

    @Override
    public String generatePoNumber() {
        long count = purchaseOrderRepository.count() + 1;
        return String.format("PO-%d-%05d", Year.now().getValue(), count);
    }
}
