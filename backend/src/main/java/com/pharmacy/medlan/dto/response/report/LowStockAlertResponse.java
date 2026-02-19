package com.pharmacy.medlan.dto.response.report;

import com.pharmacy.medlan.enums.AlertLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockAlertResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private Long branchId;
    private String branchName;
    private Integer currentStock;
    private Integer reorderLevel;
    private AlertLevel alertLevel;
    private LocalDateTime alertGeneratedAt;
    private Boolean isAcknowledged;
    private LocalDateTime acknowledgedAt;
}
