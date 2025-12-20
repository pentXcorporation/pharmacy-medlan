package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateSaleRequest;
import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.enums.SaleStatus;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.InsufficientStockException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.SaleMapper;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.pos.*;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.pos.*;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final SaleMapper saleMapper;

    @Override
    public SaleResponse createSale(CreateSaleRequest request) {
        log.info("Creating new sale for branch: {}", request.getBranchId());

        // Get current user
        User currentUser = SecurityUtils.getCurrentUser(userRepository);

        // Get branch
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

        // Get customer if specified
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));
        }

        // Create Invoice first
        Invoice invoice = createInvoice(branch, customer, request);

        // Create Sale
        Sale sale = Sale.builder()
                .saleNumber(generateSaleNumber())
                .invoice(invoice)
                .branch(branch)
                .customer(customer)
                .saleDate(LocalDateTime.now())
                .paymentMethod(request.getPaymentMethod())
                .status(SaleStatus.COMPLETED)
                .soldBy(currentUser)
                .patientName(request.getPatientName())
                .doctorName(request.getDoctorName())
                .remarks(request.getRemarks())
                .saleItems(new ArrayList<>())
                .build();

        // Process sale items
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (CreateSaleRequest.SaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            // Get or determine batch
            InventoryBatch batch = determineBatch(product, branch, itemRequest);

            // Validate stock
            if (batch.getQuantityAvailable() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getProductName() +
                        ". Available: " + batch.getQuantityAvailable() + ", Requested: " + itemRequest.getQuantity());
            }

            // Calculate item amounts
            BigDecimal unitPrice = product.getSellingPrice();
            BigDecimal itemDiscount = itemRequest.getDiscountAmount() != null ? 
                    itemRequest.getDiscountAmount() : BigDecimal.ZERO;
            BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            BigDecimal itemTax = calculateTax(product, itemSubtotal.subtract(itemDiscount));
            BigDecimal itemTotal = itemSubtotal.subtract(itemDiscount).add(itemTax);

            SaleItem saleItem = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .inventoryBatch(batch)
                    .productName(product.getProductName())
                    .batchNumber(batch.getBatchNumber())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(unitPrice)
                    .discountAmount(itemDiscount)
                    .taxAmount(itemTax)
                    .totalAmount(itemTotal)
                    .costPrice(batch.getPurchasePrice())
                    .profit(itemTotal.subtract(batch.getPurchasePrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()))))
                    .build();

            sale.getSaleItems().add(saleItem);

            // Reduce inventory
            batch.setQuantityAvailable(batch.getQuantityAvailable() - itemRequest.getQuantity());
            batch.setQuantitySold(batch.getQuantitySold() + itemRequest.getQuantity());
            inventoryBatchRepository.save(batch);

            subtotal = subtotal.add(itemSubtotal);
            totalTax = totalTax.add(itemTax);
        }

        // Apply sale-level discount
        BigDecimal saleDiscount = request.getDiscountAmount() != null ? 
                request.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal saleDiscountPercent = request.getDiscountPercent() != null ? 
                request.getDiscountPercent() : BigDecimal.ZERO;

        if (saleDiscountPercent.compareTo(BigDecimal.ZERO) > 0) {
            saleDiscount = subtotal.multiply(saleDiscountPercent)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        BigDecimal totalAmount = subtotal.subtract(saleDiscount).add(totalTax);
        BigDecimal changeAmount = request.getPaidAmount().subtract(totalAmount);

        if (changeAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleViolationException("Paid amount is less than total amount");
        }

        // Update sale amounts
        sale.setSubtotal(subtotal);
        sale.setDiscountAmount(saleDiscount);
        sale.setDiscountPercent(saleDiscountPercent);
        sale.setTaxAmount(totalTax);
        sale.setTotalAmount(totalAmount);
        sale.setPaidAmount(request.getPaidAmount());
        sale.setChangeAmount(changeAmount);

        // Update invoice
        invoice.setSubtotal(subtotal);
        invoice.setDiscount(saleDiscount);
        invoice.setTotalAmount(totalAmount);
        invoice.setPaidAmount(request.getPaidAmount());
        invoice.setBalanceAmount(BigDecimal.ZERO);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoice);

        Sale savedSale = saleRepository.save(sale);
        log.info("Sale created successfully with number: {}", savedSale.getSaleNumber());

        return saleMapper.toResponse(savedSale);
    }

    private Invoice createInvoice(Branch branch, Customer customer, CreateSaleRequest request) {
        return invoiceRepository.save(Invoice.builder()
                .invoiceNumber(generateInvoiceNumber())
                .branch(branch)
                .customer(customer)
                .invoiceDate(LocalDate.now())
                .status(InvoiceStatus.DRAFT)
                .paymentStatus(PaymentStatus.UNPAID)
                .paymentType(request.getPaymentMethod())
                .subtotal(BigDecimal.ZERO)
                .discount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(BigDecimal.ZERO)
                .build());
    }

    private InventoryBatch determineBatch(Product product, Branch branch, 
            CreateSaleRequest.SaleItemRequest itemRequest) {
        if (itemRequest.getInventoryBatchId() != null) {
            return inventoryBatchRepository.findById(itemRequest.getInventoryBatchId())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryBatch not found with id: " + 
                            itemRequest.getInventoryBatchId()));
        }

        // Get batch with earliest expiry (FEFO - First Expiry First Out)
        List<InventoryBatch> batches = inventoryBatchRepository
                .findAvailableBatchesByProductOrderByExpiryDateAsc(product.getId(), branch.getId());

        if (batches.isEmpty()) {
            throw new InsufficientStockException("No available stock for product: " + product.getProductName());
        }

        return batches.get(0);
    }

    private BigDecimal calculateTax(Product product, BigDecimal amount) {
        if (product.getTaxCategory() != null && product.getTaxCategory().getTaxRate() != null) {
            return amount.multiply(product.getTaxCategory().getTaxRate())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
        return saleMapper.toResponse(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getSaleBySaleNumber(String saleNumber) {
        Sale sale = saleRepository.findBySaleNumber(saleNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with number: " + saleNumber));
        return saleMapper.toResponse(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getAllSales(Pageable pageable) {
        return saleRepository.findAll(pageable).map(saleMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getSalesByBranch(Long branchId, Pageable pageable) {
        return saleRepository.findAll(pageable).map(saleMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getSalesByCustomer(Long customerId, Pageable pageable) {
        return saleRepository.findAll(pageable).map(saleMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return saleMapper.toResponseList(saleRepository.findBySaleDateBetween(startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesByBranchAndDateRange(Long branchId, LocalDateTime startDate, 
            LocalDateTime endDate) {
        return saleMapper.toResponseList(
                saleRepository.findByBranchAndDateRange(branchId, startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getSalesByStatus(SaleStatus status, Pageable pageable) {
        return saleRepository.findAll(pageable).map(saleMapper::toResponse);
    }

    @Override
    public SaleResponse cancelSale(Long id, String reason) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        if (sale.getStatus() == SaleStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Sale is already cancelled");
        }

        // Restore inventory
        for (SaleItem item : sale.getSaleItems()) {
            if (item.getInventoryBatch() != null) {
                InventoryBatch batch = item.getInventoryBatch();
                batch.setQuantityAvailable(batch.getQuantityAvailable() + item.getQuantity());
                batch.setQuantitySold(batch.getQuantitySold() - item.getQuantity());
                inventoryBatchRepository.save(batch);
            }
        }

        sale.setStatus(SaleStatus.CANCELLED);
        sale.setRemarks((sale.getRemarks() != null ? sale.getRemarks() + "\n" : "") + 
                "Cancelled: " + reason);

        // Update invoice status
        if (sale.getInvoice() != null) {
            sale.getInvoice().setStatus(InvoiceStatus.CANCELLED);
            invoiceRepository.save(sale.getInvoice());
        }

        return saleMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    public SaleResponse voidSale(Long id, String reason) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        if (sale.getStatus() == SaleStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Sale is already voided/cancelled");
        }

        // Restore inventory
        for (SaleItem item : sale.getSaleItems()) {
            if (item.getInventoryBatch() != null) {
                InventoryBatch batch = item.getInventoryBatch();
                batch.setQuantityAvailable(batch.getQuantityAvailable() + item.getQuantity());
                batch.setQuantitySold(batch.getQuantitySold() - item.getQuantity());
                inventoryBatchRepository.save(batch);
            }
        }

        sale.setStatus(SaleStatus.CANCELLED);
        sale.setRemarks((sale.getRemarks() != null ? sale.getRemarks() + "\n" : "") + 
                "Voided: " + reason);

        if (sale.getInvoice() != null) {
            sale.getInvoice().setStatus(InvoiceStatus.VOID);
            invoiceRepository.save(sale.getInvoice());
        }

        return saleMapper.toResponse(saleRepository.save(sale));
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalSalesByBranchAndDate(Long branchId, LocalDateTime startDate, 
            LocalDateTime endDate) {
        BigDecimal total = saleRepository.getTotalSalesByBranchAndDate(branchId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public Long getSalesCountByBranchAndDate(Long branchId, LocalDateTime startDate, 
            LocalDateTime endDate) {
        return (long) saleRepository.findByBranchAndDateRange(branchId, startDate, endDate).size();
    }

    @Override
    public String generateSaleNumber() {
        String prefix = "SALE-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-";
        Long count = saleRepository.count() + 1;
        return prefix + String.format("%05d", count);
    }

    private String generateInvoiceNumber() {
        String prefix = "INV-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy")) + "-";
        Long count = invoiceRepository.count() + 1;
        return prefix + String.format("%05d", count);
    }
}
