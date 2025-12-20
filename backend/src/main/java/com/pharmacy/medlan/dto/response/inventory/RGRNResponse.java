package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RGRNResponse {

    private Long id;
    private String rgrnNumber;
    private Long originalGrnId;
    private String originalGrnNumber;
    private Long supplierId;
    private String supplierName;
    private Long branchId;
    private String branchName;
    private LocalDate returnDate;
    private BigDecimal totalReturnAmount;
    private PaymentStatus refundStatus;
    private String returnReason;
    private String returnedByName;
    private String remarks;
    private List<RGRNLineResponse> lines;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RGRNLineResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Long inventoryBatchId;
        private String batchNumber;
        private Integer quantityReturned;
        private BigDecimal unitPrice;
        private BigDecimal totalAmount;
        private String returnReason;
    }
}
