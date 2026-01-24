package com.pharmacy.medlan.dto.finance;

import com.pharmacy.medlan.enums.CashRegisterTransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashRegisterTransactionResponse {

    private Long id;
    private CashRegisterTransactionType type;
    private BigDecimal amount;
    private String description;
    private String category;
    private LocalDateTime timestamp;
    
    // User info
    private Long userId;
    private String userName;
    
    // CashBook reference
    private Long cashBookId;
    
    private LocalDateTime createdAt;
}
