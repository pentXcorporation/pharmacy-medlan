package com.pharmacy.medlan.dto.request.finance;

import com.pharmacy.medlan.enums.ChequeStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateChequeRequest {

    @NotBlank(message = "Cheque number is required")
    @Size(max = 100, message = "Cheque number cannot exceed 100 characters")
    private String chequeNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 12, fraction = 2, message = "Invalid amount format")
    private BigDecimal amount;

    @NotNull(message = "Cheque date is required")
    private LocalDate chequeDate;

    @NotNull(message = "Deposit date is required")
    private LocalDate depositDate;

    private LocalDate clearanceDate;

    @NotNull(message = "Bank ID is required")
    private Long bankId;

    @Size(max = 200, message = "Bank name cannot exceed 200 characters")
    private String bankName;

    private Long customerId;

    private Long supplierId;

    @Size(max = 200, message = "Received from cannot exceed 200 characters")
    private String receivedFrom;

    @Size(max = 200, message = "Company name cannot exceed 200 characters")
    private String company;

    @NotNull(message = "Status is required")
    private ChequeStatus status;

    @Size(max = 1000, message = "Remarks cannot exceed 1000 characters")
    private String remarks;

    @Size(max = 100, message = "Reference number cannot exceed 100 characters")
    private String referenceNumber;

    private Boolean isRecordedInBank;
}

