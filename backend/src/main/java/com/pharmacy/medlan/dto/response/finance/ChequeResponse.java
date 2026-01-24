package com.pharmacy.medlan.dto.response.finance;

import com.pharmacy.medlan.enums.ChequeStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChequeResponse {

    private Long id;
    private String chequeNumber;
    private BigDecimal amount;
    private LocalDate chequeDate;
    private LocalDate depositDate;
    private LocalDate clearanceDate;
    
    // Bank details
    private Long bankId;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    
    // Payer details
    private Long customerId;
    private String customerName;
    private Long supplierId;
    private String supplierName;
    private String receivedFrom;
    private String company;
    
    // Status and tracking
    private ChequeStatus status;
    private String remarks;
    private String referenceNumber;
    
    // Financial tracking
    private Boolean isRecordedInBank;
    private Boolean reconciled;
    private LocalDate reconciliationDate;
    private Long bankTransactionId;
    
    // Bounce information
    private String bounceReason;
    private LocalDate bounceDate;
    private BigDecimal bounceCharges;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}

