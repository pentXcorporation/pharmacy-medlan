package com.pharmacy.medlan.dto.request.pos;

import com.pharmacy.medlan.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceRequest {

    private Long customerId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Sale ID is required")
    private Long saleId;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    @DecimalMin(value = "0.00", message = "Subtotal must not be negative")
    private BigDecimal subtotal;

    @DecimalMin(value = "0.00", message = "Discount must not be negative")
    private BigDecimal discount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.00", message = "Total amount must not be negative")
    private BigDecimal totalAmount;

    @DecimalMin(value = "0.00", message = "Paid amount must not be negative")
    private BigDecimal paidAmount;

    @NotNull(message = "Payment type is required")
    private PaymentMethod paymentType;

    @Size(max = 50, message = "Cheque number must not exceed 50 characters")
    private String chequeNumber;

    private LocalDate chequeDate;

    @Size(max = 200, message = "Card details must not exceed 200 characters")
    private String cardDetails;

    @Size(max = 200, message = "Doctor name must not exceed 200 characters")
    private String doctorName;

    @Size(max = 50, message = "Patient number must not exceed 50 characters")
    private String patientNumber;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
