package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.AlertLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpiryAlertResponse {
    
    private Long alertId;
    private Long batchId;
    private String batchNumber;
    
    private Long productId;
    private String productCode;
    private String productName;
    private String genericName;
    private String manufacturer;
    
    private Long branchId;
    private String branchName;
    private String rackLocation;
    
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private Integer daysToExpiry;
    private Boolean isExpired;
    
    private Integer quantityAvailable;
    private BigDecimal purchasePrice;
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    
    private BigDecimal potentialLoss; // quantity * purchase price
    private BigDecimal retailValue;   // quantity * selling price
    
    private AlertLevel alertLevel;
    private String alertMessage;
    private String recommendedAction;
    
    private LocalDateTime detectedAt;
    private LocalDateTime acknowledgedAt;
    private String acknowledgedBy;
    
    /**
     * Generate recommended action based on days to expiry
     */
    public static String getRecommendedAction(int daysToExpiry, int quantity) {
        if (daysToExpiry < 0) {
            return "URGENT: Remove from shelf immediately. Process return to supplier or dispose as per regulations.";
        } else if (daysToExpiry <= 30) {
            return "CRITICAL: Consider marking down for quick sale. Contact supplier for returns if applicable.";
        } else if (daysToExpiry <= 60) {
            return "HIGH PRIORITY: Prioritize this batch for sales. Consider promotional pricing.";
        } else if (daysToExpiry <= 90) {
            return "Monitor closely. Use FEFO (First Expiry First Out) strictly.";
        } else {
            return "Normal monitoring. Ensure proper stock rotation.";
        }
    }
}
