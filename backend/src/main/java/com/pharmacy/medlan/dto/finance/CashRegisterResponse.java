package com.pharmacy.medlan.dto.finance;

import com.pharmacy.medlan.enums.CashRegisterStatus;
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
public class CashRegisterResponse {

    private Long id;
    private LocalDate registerDate;
    private CashRegisterStatus status;
    
    // Branch info
    private Long branchId;
    private String branchName;
    
    // Balances
    private BigDecimal openingBalance;
    private BigDecimal closingBalance;
    private BigDecimal expectedClosingBalance;
    private BigDecimal discrepancy;
    
    // Totals
    private BigDecimal cashInTotal;
    private BigDecimal cashOutTotal;
    private BigDecimal salesTotal;
    
    // Bank deposit
    private Long depositedBankId;
    private String depositedBankName;
    private LocalDateTime depositedAt;
    
    // User info
    private Long openedById;
    private String openedByName;
    private LocalDateTime openedAt;
    
    private Long closedById;
    private String closedByName;
    private LocalDateTime closedAt;
    
    private String notes;
    
    // Transactions
    private List<CashRegisterTransactionResponse> transactions;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
