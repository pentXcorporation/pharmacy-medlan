package com.pharmacy.medlan.dto.finance;

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
public class OpenCashRegisterRequest {

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Opening balance is required")
    @Positive(message = "Opening balance must be positive")
    private BigDecimal openingBalance;

    private String notes;
}
