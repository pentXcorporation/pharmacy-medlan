package com.pharmacy.medlan.dto.finance;

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
public class CashRegisterSummaryResponse {

    private LocalDate date;
    private Long branchId;
    private String branchName;
    
    private int totalRegisters;
    private int openRegisters;
    private int closedRegisters;
    
    private BigDecimal totalOpeningBalance;
    private BigDecimal totalClosingBalance;
    private BigDecimal totalSales;
    private BigDecimal totalCashIn;
    private BigDecimal totalCashOut;
    private BigDecimal totalDiscrepancies;
    private BigDecimal totalDeposited;
}
