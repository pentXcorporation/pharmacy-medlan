package com.pharmacy.medlan.dto.response.pos;

import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.SaleStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleResponse {

    private Long id;
    private String saleNumber;
    private Long invoiceId;
    private String invoiceNumber;
    private Long branchId;
    private String branchName;
    private Long customerId;
    private String customerName;
    private LocalDateTime saleDate;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal discountPercent;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal changeAmount;
    private PaymentMethod paymentMethod;
    private SaleStatus status;
    private String soldByUserName;
    private String patientName;
    private String doctorName;
    private String remarks;
    private List<SaleItemResponse> items;
    private LocalDateTime createdAt;
}
