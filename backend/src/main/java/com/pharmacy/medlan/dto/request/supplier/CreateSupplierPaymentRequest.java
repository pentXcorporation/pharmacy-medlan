package com.pharmacy.medlan.dto.request.supplier;

import com.pharmacy.medlan.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSupplierPaymentRequest {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String chequeNumber;

    private LocalDate chequeDate;

    private String bankName;

    private String transactionReference;

    private String remarks;

    @Valid
    private List<PaymentDetailRequest> paymentDetails;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetailRequest {

        private Long grnId;

        private String invoiceNumber;

        @NotNull(message = "Paid amount is required")
        @Positive(message = "Paid amount must be positive")
        private BigDecimal paidAmount;
    }
}