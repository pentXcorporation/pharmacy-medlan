package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.GRNStatus;
import com.pharmacy.medlan.enums.PaymentStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GRNResponse {

    private Long id;
    private String grnNumber;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private Long supplierId;
    private String supplierName;
    private Long branchId;
    private String branchName;
    private LocalDate receivedDate;
    private String supplierInvoiceNumber;
    private LocalDate supplierInvoiceDate;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal netAmount;
    private GRNStatus status;
    private String remarks;
    private String receivedByUserName;
    private String approvedByUserName;
    private LocalDateTime approvedAt;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private PaymentStatus paymentStatus;
    private List<GRNLineResponse> items;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GRNLineResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productCode;
        private String batchNumber;
        private Integer quantity;
        private BigDecimal costPrice;
        private BigDecimal sellingPrice;
        private LocalDate manufacturingDate;
        private LocalDate expiryDate;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
    }
}
