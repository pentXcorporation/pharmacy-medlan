package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.AlertLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockAlertResponse {
    
    private Long alertId;
    private Long productId;
    private String productCode;
    private String productName;
    private String genericName;
    private String categoryName;
    
    private Long branchId;
    private String branchName;
    
    private Integer currentStock;
    private Integer reorderLevel;
    private Integer minimumStock;
    private Integer maximumStock;
    
    private Integer stockDeficit;
    private Integer suggestedOrderQuantity;
    
    private AlertLevel alertLevel;
    private String alertMessage;
    
    private BigDecimal lastPurchasePrice;
    private String preferredSupplier;
    
    private LocalDateTime detectedAt;
    private LocalDateTime acknowledgedAt;
    private String acknowledgedBy;
    
    private Integer daysOutOfStock;
    private BigDecimal estimatedLostRevenue;
}
