package com.pharmacy.medlan.dto.response.inventory;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryBatchResponse {

    private Long id;
    private Long productId;
    private String productCode;
    private String productName;
    private Long branchId;
    private String branchName;
    private String batchNumber;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private Integer quantityReceived;
    private Integer quantityAvailable;
    private Integer quantitySold;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private Boolean isActive;
    private Boolean isExpired;
    private Integer daysToExpiry;
    private LocalDateTime createdAt;
}
