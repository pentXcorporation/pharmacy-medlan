package com.pharmacy.medlan.service.inventory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharmacy.medlan.dto.request.inventory.BarcodeScanRequest;
import com.pharmacy.medlan.dto.response.inventory.ScanResultResponse;
import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.enums.ScanContext;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.product.BranchInventory;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.repository.product.BranchInventoryRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class InventoryScanServiceImpl implements InventoryScanService {

    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchInventoryRepository branchInventoryRepository;
    private final ObjectMapper objectMapper;

    @Override
    public ScanResultResponse processScan(BarcodeScanRequest request) {
        log.info("Processing scan: {} for context: {}", request.getScanData(), request.getContext());

        if (request.isQrCode()) {
            return processQRCodeScan(request);
        }

        return switch (request.getContext()) {
            case POS -> quickLookupForPOS(request.getScanData(), request.getBranchId());
            case GRN -> lookupForReceiving(request.getScanData(), request.getBranchId());
            case STOCK_TAKING -> lookupForStockTaking(request.getScanData(), request.getBranchId());
            case EXPIRY_CHECK -> lookupForExpiryCheck(request.getScanData(), request.getBranchId());
            case PRICE_CHECK -> lookupForPriceCheck(request.getScanData(), request.getBranchId());
            default -> quickLookupForPOS(request.getScanData(), request.getBranchId());
        };
    }

    @Override
    @Cacheable(value = "productScans", key = "#barcode + '_' + #branchId")
    public ScanResultResponse quickLookupForPOS(String barcode, Long branchId) {
        log.debug("Quick lookup for POS: barcode={}, branch={}", barcode, branchId);
        try {
            Product product = findProductByBarcode(barcode);
            ScanResultResponse response = buildBasicResponse(product, barcode, ScanContext.POS);

            // Get branch-specific stock (ISOLATION: Checking only this branch)
            Optional<BranchInventory> branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(product.getId(), branchId);
            int stockAtBranch = branchInventory.map(BranchInventory::getQuantityAvailable).orElse(0);

            response.setStockAtBranch(stockAtBranch);
            response.setStockStatus(getStockStatus(stockAtBranch, product.getReorderLevel(), product.getMinimumStock()));

            // Get available batches (FEFO sorted - First Expiring First Out)
            List<InventoryBatch> batches = inventoryBatchRepository
                    .findAvailableBatchesByProductAndBranch(product.getId(), branchId);

            List<ScanResultResponse.BatchInfo> batchInfos = batches.stream()
                    .map(this::toBatchInfo)
                    .collect(Collectors.toList());
            response.setAvailableBatches(batchInfos);

            // FRAUD PREVENTION: Auto-select batch but strictly validate
            if (!batchInfos.isEmpty()) {
                response.setSuggestedBatch(batchInfos.get(0)); // Suggest the one expiring soonest
            }

            // Check if can add to cart and generate safety alerts
            validateForPOS(response, product, stockAtBranch);

            // Generate Alerts (Low stock, Expiry, Price Margin Safety)
            response.setAlerts(generateAlerts(product, batches, stockAtBranch));

            return response;
        } catch (ResourceNotFoundException e) {
            return ScanResultResponse.error(barcode, "Product not found for barcode: " + barcode);
        }
    }

    @Override
    public ScanResultResponse lookupForReceiving(String barcode, Long branchId) {
        log.debug("Lookup for receiving: barcode={}, branch={}", barcode, branchId);
        try {
            Product product = findProductByBarcode(barcode);
            ScanResultResponse response = buildBasicResponse(product, barcode, ScanContext.GRN);

            // REAL LIFE SCENARIO: Assist the user by showing supplier info and pending orders
            Map<String, Object> additionalData = new HashMap<>();
            additionalData.put("preferredSupplier", product.getSupplier());
            additionalData.put("lastPurchasePrice", product.getCostPrice());
            additionalData.put("reorderLevel", product.getReorderLevel());
            additionalData.put("maximumStock", product.getMaximumStock());

            // Get current stock
            Optional<BranchInventory> branchInventory = branchInventoryRepository
                    .findByProductIdAndBranchId(product.getId(), branchId);
            int currentStock = branchInventory.map(BranchInventory::getQuantityAvailable).orElse(0);

            // Suggest order quantity to fill up to max
            int suggestedOrderQty = Math.max(0, product.getMaximumStock() - currentStock);
            additionalData.put("currentStock", currentStock);
            additionalData.put("suggestedOrderQuantity", suggestedOrderQty);

            // TODO: Look up pending POs for this product to prevent double ordering
            // additionalData.put("pendingPO", purchaseOrderRepository.countPendingByProduct(product.getId()));

            response.setAdditionalData(additionalData);
            response.setStockAtBranch(currentStock);

            return response;
        } catch (ResourceNotFoundException e) {
            return ScanResultResponse.error(barcode, "Product not found for barcode: " + barcode);
        }
    }

    @Override
    public ScanResultResponse lookupForStockTaking(String barcode, Long branchId) {
        log.debug("Lookup for stock taking: barcode={}, branch={}", barcode, branchId);
        try {
            Product product = findProductByBarcode(barcode);
            ScanResultResponse response = buildBasicResponse(product, barcode, ScanContext.STOCK_TAKING);

            // Get ALL batches including expired ones for audit purposes
            List<InventoryBatch> allBatches = inventoryBatchRepository
                    .findAllByProductIdAndBranchId(product.getId(), branchId);

            List<ScanResultResponse.BatchInfo> batchInfos = allBatches.stream()
                    .map(this::toBatchInfo)
                    .collect(Collectors.toList());
            response.setAvailableBatches(batchInfos);

            int totalSystem = allBatches.stream()
                    .filter(b -> !b.getIsExpired())
                    .mapToInt(InventoryBatch::getQuantityAvailable)
                    .sum();
            response.setStockAtBranch(totalSystem);

            Map<String, Object> additionalData = new HashMap<>();
            additionalData.put("systemStock", totalSystem);
            additionalData.put("totalBatches", allBatches.size());
            additionalData.put("activeBatches", allBatches.stream().filter(b -> b.getIsActive() && !b.getIsExpired()).count());
            additionalData.put("expiredBatches", allBatches.stream().filter(InventoryBatch::getIsExpired).count());
            response.setAdditionalData(additionalData);

            return response;
        } catch (ResourceNotFoundException e) {
            return ScanResultResponse.error(barcode, "Product not found for barcode: " + barcode);
        }
    }

    @Override
    public ScanResultResponse verifyProduct(String qrData) {
        log.debug("Verifying product via QR: {}", qrData);
        try {
            Map<String, Object> qrContent = objectMapper.readValue(qrData, Map.class);
            String type = (String) qrContent.get("type");

            if ("PRODUCT".equals(type)) {
                Long productId = Long.valueOf(qrContent.get("id").toString());
                String code = (String) qrContent.get("code");

                Product product = productRepository.findById(productId).orElse(null);
                ScanResultResponse response = ScanResultResponse.success(
                        UUID.randomUUID().toString(),
                        qrData,
                        ScanContext.VERIFICATION
                );

                boolean verified = product != null && product.getProductCode().equals(code);
                Map<String, Object> additionalData = new HashMap<>();
                additionalData.put("verified", verified);
                additionalData.put("verificationStatus", verified ? "AUTHENTIC" : "MISMATCH");
                response.setAdditionalData(additionalData);

                if (verified && product != null) {
                    response.setProductId(product.getId());
                    response.setProductCode(product.getProductCode());
                    response.setProductName(product.getProductName());
                }
                return response;
            }
            return ScanResultResponse.error(qrData, "Invalid QR code type for verification");
        } catch (JsonProcessingException e) {
            return ScanResultResponse.error(qrData, "Invalid QR code format");
        }
    }

    @Override
    public ScanResultResponse processBatchQRScan(String qrData, Long branchId) {
        try {
            Map<String, Object> qrContent = objectMapper.readValue(qrData, Map.class);
            if (!"BATCH".equals(qrContent.get("type"))) {
                return ScanResultResponse.error(qrData, "Not a batch QR code");
            }

            Long batchId = Long.valueOf(qrContent.get("batchId").toString());
            InventoryBatch batch = inventoryBatchRepository.findById(batchId)
                    .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
            Product product = batch.getProduct();

            ScanResultResponse response = buildBasicResponse(product, qrData, ScanContext.GRN);
            response.setSuggestedBatch(toBatchInfo(batch));
            response.setStockAtBranch(batch.getQuantityAvailable());
            return response;
        } catch (JsonProcessingException e) {
            return ScanResultResponse.error(qrData, "Invalid batch QR code format");
        }
    }

    @Override
    public List<ScanResultResponse> processBulkScans(List<String> barcodes, Long branchId, ScanContext context) {
        return barcodes.stream()
                .map(barcode -> {
                    BarcodeScanRequest request = BarcodeScanRequest.builder()
                            .scanData(barcode)
                            .branchId(branchId)
                            .context(context)
                            .build();
                    return processScan(request);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ScanResultResponse> getScanHistory(Long branchId, Long userId, int limit) {
        return Collections.emptyList();
    }

    // ==================== Private Helper Methods ====================

    private Product findProductByBarcode(String barcode) {
        Optional<Product> byBarcode = productRepository.findByBarcode(barcode);
        if (byBarcode.isPresent()) return byBarcode.get();

        Optional<Product> byCode = productRepository.findByProductCode(barcode);
        if (byCode.isPresent()) return byCode.get();

        throw new ResourceNotFoundException("Product not found for barcode/code: " + barcode);
    }

    private ScanResultResponse buildBasicResponse(Product product, String scannedData, ScanContext context) {
        return ScanResultResponse.builder()
                .scanId(UUID.randomUUID().toString())
                .scannedData(scannedData)
                .context(context)
                .scannedAt(LocalDateTime.now())
                .success(true)
                .productId(product.getId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .genericName(product.getGenericName())
                .barcode(product.getBarcode())
                .manufacturer(product.getManufacturer())
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .subCategoryName(product.getSubCategory() != null ? product.getSubCategory().getSubCategoryName() : null)
                .unitName(product.getUnit() != null ? product.getUnit().getUnitName() : null)
                .dosageForm(product.getDosageForm())
                .strength(product.getStrength())
                .drugSchedule(product.getDrugSchedule())
                .prescriptionRequired(Boolean.TRUE.equals(product.getIsPrescriptionRequired()))
                .isNarcotic(Boolean.TRUE.equals(product.getIsNarcotic()))
                .isRefrigerated(Boolean.TRUE.equals(product.getIsRefrigerated()))
                .mrp(product.getMrp())
                .sellingPrice(product.getSellingPrice())
                .costPrice(product.getCostPrice())
                .gstRate(product.getGstRate())
                .build();
    }

    private ScanResultResponse.BatchInfo toBatchInfo(InventoryBatch batch) {
        long daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), batch.getExpiryDate());
        return ScanResultResponse.BatchInfo.builder()
                .batchId(batch.getId())
                .batchNumber(batch.getBatchNumber())
                .expiryDate(batch.getExpiryDate())
                .daysToExpiry((int) daysToExpiry)
                .quantityAvailable(batch.getQuantityAvailable())
                .purchasePrice(batch.getPurchasePrice())
                .mrp(batch.getMrp())
                .sellingPrice(batch.getSellingPrice())
                .rackLocation(batch.getRackLocation())
                .isExpired(batch.getIsExpired() || daysToExpiry < 0)
                .isExpiringSoon(daysToExpiry >= 0 && daysToExpiry <= 90)
                .build();
    }

    private String getStockStatus(int stock, int reorderLevel, int minimumStock) {
        if (stock == 0) return "OUT_OF_STOCK";
        if (stock < minimumStock) return "CRITICAL";
        if (stock < reorderLevel) return "LOW_STOCK";
        return "IN_STOCK";
    }

    private void validateForPOS(ScanResultResponse response, Product product, int stock) {
        List<String> blockReasons = new ArrayList<>();

        if (stock == 0) {
            blockReasons.add("Out of stock");
        }

        if (Boolean.TRUE.equals(product.getIsDiscontinued())) {
            blockReasons.add("Product discontinued");
        }

        if (Boolean.FALSE.equals(product.getIsActive())) {
            blockReasons.add("Product not active");
        }

        // FRAUD PREVENTION: Margin Check
        // If Selling Price is less than Cost Price, block sale or require Manager override
        if (product.getSellingPrice() != null && product.getCostPrice() != null) {
            if (product.getSellingPrice().compareTo(product.getCostPrice()) < 0) {
                // We add it to warnings, or block if strict
                response.setAlerts(List.of(ScanResultResponse.AlertInfo.builder()
                        .level(AlertLevel.CRITICAL)
                        .alertType("LOSS_WARNING")
                        .message("Selling Price is below Cost Price!")
                        .action("Manager Authorization Required")
                        .build()));
                // Uncomment to strictly block:
                // blockReasons.add("Price Protection: Selling price below cost");
            }
        }

        if (Boolean.TRUE.equals(product.getIsPrescriptionRequired())) {
            response.setAlerts(List.of(ScanResultResponse.AlertInfo.builder()
                    .level(AlertLevel.WARNING)
                    .alertType("PRESCRIPTION_REQUIRED")
                    .message("This product requires a prescription")
                    .action("Verify prescription before dispensing")
                    .build()));
        }

        response.setCanAddToCart(blockReasons.isEmpty());
        if (!blockReasons.isEmpty()) {
            response.setAddToCartBlockReason(String.join("; ", blockReasons));
        }
    }

    private List<ScanResultResponse.AlertInfo> generateAlerts(Product product, List<InventoryBatch> batches, int stock) {
        List<ScanResultResponse.AlertInfo> alerts = new ArrayList<>();

        // Stock alerts
        if (stock == 0) {
            alerts.add(ScanResultResponse.AlertInfo.builder()
                    .level(AlertLevel.CRITICAL)
                    .alertType("OUT_OF_STOCK")
                    .message("Product is out of stock")
                    .action("Urgent reorder required")
                    .build());
        } else if (stock < product.getMinimumStock()) {
            alerts.add(ScanResultResponse.AlertInfo.builder()
                    .level(AlertLevel.URGENT)
                    .alertType("BELOW_MINIMUM")
                    .message("Stock below minimum level")
                    .action("Immediate reorder recommended")
                    .build());
        } else if (stock < product.getReorderLevel()) {
            alerts.add(ScanResultResponse.AlertInfo.builder()
                    .level(AlertLevel.WARNING)
                    .alertType("LOW_STOCK")
                    .message("Stock below reorder level")
                    .action("Consider placing reorder")
                    .build());
        }

        // Expiry alerts
        for (InventoryBatch batch : batches) {
            long daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), batch.getExpiryDate());
            if (daysToExpiry < 0) {
                alerts.add(ScanResultResponse.AlertInfo.builder()
                        .level(AlertLevel.CRITICAL)
                        .alertType("EXPIRED")
                        .message("Batch " + batch.getBatchNumber() + " has expired")
                        .action("Remove from sale immediately")
                        .build());
            } else if (daysToExpiry <= 30) {
                alerts.add(ScanResultResponse.AlertInfo.builder()
                        .level(AlertLevel.URGENT)
                        .alertType("EXPIRING_SOON")
                        .message("Batch " + batch.getBatchNumber() + " expires in " + daysToExpiry + " days")
                        .action("Prioritize for sale or return")
                        .build());
            }
        }

        // Drug schedule alerts
        if (Boolean.TRUE.equals(product.getIsNarcotic())) {
            alerts.add(ScanResultResponse.AlertInfo.builder()
                    .level(AlertLevel.WARNING)
                    .alertType("NARCOTIC")
                    .message("Schedule X drug - Strict dispensing controls apply")
                    .action("Verify prescription and maintain register")
                    .build());
        }

        return alerts;
    }

    private ScanResultResponse lookupForExpiryCheck(String barcode, Long branchId) {
        try {
            Product product = findProductByBarcode(barcode);
            ScanResultResponse response = buildBasicResponse(product, barcode, ScanContext.EXPIRY_CHECK);

            List<InventoryBatch> batches = inventoryBatchRepository
                    .findAllByProductIdAndBranchId(product.getId(), branchId);

            List<ScanResultResponse.BatchInfo> batchInfos = batches.stream()
                    .map(this::toBatchInfo)
                    .sorted(Comparator.comparing(ScanResultResponse.BatchInfo::getExpiryDate))
                    .collect(Collectors.toList());

            response.setAvailableBatches(batchInfos);
            response.setAlerts(generateAlerts(product, batches, batches.stream().mapToInt(InventoryBatch::getQuantityAvailable).sum()));

            return response;
        } catch (ResourceNotFoundException e) {
            return ScanResultResponse.error(barcode, "Product not found");
        }
    }

    private ScanResultResponse lookupForPriceCheck(String barcode, Long branchId) {
        try {
            Product product = findProductByBarcode(barcode);
            ScanResultResponse response = buildBasicResponse(product, barcode, ScanContext.PRICE_CHECK);

            Map<String, Object> additionalData = new HashMap<>();
            additionalData.put("mrp", product.getMrp());
            additionalData.put("sellingPrice", product.getSellingPrice());
            additionalData.put("discount", calculateDiscount(product.getMrp(), product.getSellingPrice()));
            additionalData.put("gstRate", product.getGstRate());

            response.setAdditionalData(additionalData);
            return response;
        } catch (ResourceNotFoundException e) {
            return ScanResultResponse.error(barcode, "Product not found");
        }
    }

    private BigDecimal calculateDiscount(BigDecimal mrp, BigDecimal sellingPrice) {
        if (mrp == null || sellingPrice == null || mrp.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return mrp.subtract(sellingPrice)
                .divide(mrp, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private ScanResultResponse processQRCodeScan(BarcodeScanRequest request) {
        String qrData = request.getScanData();
        try {
            Map<String, Object> qrContent = objectMapper.readValue(qrData, Map.class);
            String type = (String) qrContent.get("type");

            return switch (type) {
                case "PRODUCT" -> verifyProduct(qrData);
                case "BATCH" -> processBatchQRScan(qrData, request.getBranchId());
                case "INVOICE" -> ScanResultResponse.error(qrData, "Invoice scanning not supported in this context");
                default -> ScanResultResponse.error(qrData, "Unknown QR code type: " + type);
            };
        } catch (JsonProcessingException e) {
            return processScan(BarcodeScanRequest.builder()
                    .scanData(qrData)
                    .branchId(request.getBranchId())
                    .context(request.getContext())
                    .qrCode(false)
                    .build());
        }
    }
}