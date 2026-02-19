package com.pharmacy.medlan.dto.response.report;

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

    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private Long inventoryBatchId;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer daysToExpiry;
    private Integer quantityAvailable;
    private BigDecimal batchValue;
    private AlertLevel alertLevel;
    private Long branchId;
    private String branchName;
    private LocalDateTime alertGeneratedAt;
    private Boolean isAcknowledged;
    private LocalDateTime acknowledgedAt;
}
