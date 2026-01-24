package com.pharmacy.medlan.dto.finance;

import com.pharmacy.medlan.enums.CashRegisterTransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashTransactionRequest {

    @NotNull(message = "Transaction type is required")
    private CashRegisterTransactionType type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Description is required")
    private String description;

    private String category;
}
