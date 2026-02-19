package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResultResponse {

    // Scan metadata
    private String scanId;
    private String scannedData;
    private ScanContext context;
    private LocalDateTime scannedAt;
    private boolean success;
    private String errorMessage;

    // Product information
    private Long productId;
    private String productCode;
    private String productName;
    private String genericName;
    private String barcode;
    private String manufacturer;
    private String categoryName;
    private String subCategoryName;
    private String unitName;

    // Drug information
    private DosageForm dosageForm;
    private String strength;
    private DrugSchedule drugSchedule;
    private boolean prescriptionRequired;
    private boolean isNarcotic;
    private boolean isRefrigerated;

    // Pricing (for POS context)
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    private BigDecimal costPrice;
    private BigDecimal gstRate;
    private BigDecimal discountAllowed;

    // Stock information
    private Integer totalStockAvailable;
    private Integer stockAtBranch;
    private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK

    // Batch information (for FEFO selection)
    private List<BatchInfo> availableBatches;
    private BatchInfo suggestedBatch; // FEFO recommended batch

    // Alerts
    private List<AlertInfo> alerts;

    // Context-specific data
    private Map<String, Object> additionalData;

    // For POS - quick add support
    private boolean canAddToCart;
    private String addToCartBlockReason;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchInfo {
        private Long batchId;
        private String batchNumber;
        private LocalDate expiryDate;
        private Integer daysToExpiry;
        private Integer quantityAvailable;
        private BigDecimal purchasePrice;
        private BigDecimal mrp;
        private BigDecimal sellingPrice;
        private String rackLocation;
        private boolean isExpired;
        private boolean isExpiringSoon; // Within 90 days
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertInfo {
        private AlertLevel level;
        private String alertType;
        private String message;
        private String action;
    }

    /**
     * Create a successful scan result
     */
    public static ScanResultResponse success(String scanId, String scannedData, ScanContext context) {
        return ScanResultResponse.builder()
                .scanId(scanId)
                .scannedData(scannedData)
                .context(context)
                .scannedAt(LocalDateTime.now())
                .success(true)
                .build();
    }

    /**
     * Create a failed scan result
     */
    public static ScanResultResponse error(String scannedData, String errorMessage) {
        return ScanResultResponse.builder()
                .scannedData(scannedData)
                .scannedAt(LocalDateTime.now())
                .success(false)
                .errorMessage(errorMessage)
                .canAddToCart(false)
                .addToCartBlockReason(errorMessage)
                .build();
    }
}