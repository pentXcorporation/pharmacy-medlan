package com.pharmacy.medlan.dto.response.supplier;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptResponse {

    private Long id;
    private String receiptNumber;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private Long supplierId;
    private String supplierName;
    private Long branchId;
    private String branchName;
    private LocalDate receiptDate;
    private String supplierInvoiceNumber;
    private LocalDate supplierInvoiceDate;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal netAmount;
    private String receivedByName;
    private String remarks;
    private List<GoodsReceiptItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoodsReceiptItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productCode;
        private String batchNumber;
        private LocalDate expiryDate;
        private Integer quantityReceived;
        private BigDecimal unitPrice;
        private BigDecimal totalAmount;
    }
}