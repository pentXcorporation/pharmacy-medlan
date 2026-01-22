package com.pharmacy.medlan.dto.response.finance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashBookResponse {
    private Long id;
    private LocalDate transactionDate;
    private String transactionType;
    private String description;
    private BigDecimal debitAmount;
    private BigDecimal creditAmount;
    private BigDecimal runningBalance;
    private String referenceNumber;
    private String paymentMethod;
    private String category;
    private Long branchId;
    private String branchName;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
}
