package com.pharmacy.medlan.dto.response.pos;

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
public class SaleReturnResponse {

    private Long id;
    private String returnNumber;
    private Long originalSaleId;
    private String originalSaleNumber;
    private Long branchId;
    private String branchName;
    private Long customerId;
    private String customerName;
    private LocalDate returnDate;
    private BigDecimal totalReturnAmount;
    private BigDecimal refundAmount;
    private String returnReason;
    private String processedByName;
    private List<SaleReturnItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaleReturnItemResponse {
        private Long id;
        private Long originalSaleItemId;
        private Long productId;
        private String productName;
        private String productSku;
        private Long inventoryBatchId;
        private String batchNumber;
        private Integer quantityReturned;
        private BigDecimal unitPrice;
        private BigDecimal totalAmount;
        private String returnReason;
    }
}
