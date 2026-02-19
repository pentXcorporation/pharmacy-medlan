package com.pharmacy.medlan.dto.response.supplier;

import com.pharmacy.medlan.enums.PaymentMethod;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPaymentResponse {

    private Long id;
    private String paymentNumber;
    private Long supplierId;
    private String supplierName;
    private Long branchId;
    private String branchName;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String chequeNumber;
    private LocalDate chequeDate;
    private String bankName;
    private String transactionReference;
    private String remarks;
    private String paidByName;
    private List<PaymentDetailResponse> paymentDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetailResponse {
        private Long id;
        private Long grnId;
        private String grnNumber;
        private String invoiceNumber;
        private BigDecimal invoiceAmount;
        private BigDecimal paidAmount;
        private BigDecimal balanceAmount;
    }
}