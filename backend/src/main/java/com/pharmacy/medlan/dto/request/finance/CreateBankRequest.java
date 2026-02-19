package com.pharmacy.medlan.dto.request.finance;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBankRequest {

    @NotBlank(message = "Bank name is required")
    @Size(max = 200, message = "Bank name cannot exceed 200 characters")
    private String bankName;

    @NotBlank(message = "Account number is required")
    @Size(max = 50, message = "Account number cannot exceed 50 characters")
    private String accountNumber;

    @Size(max = 50, message = "IFSC code cannot exceed 50 characters")
    private String ifscCode;

    @Size(max = 200, message = "Branch name cannot exceed 200 characters")
    private String branchName;

    @Size(max = 200, message = "Account holder name cannot exceed 200 characters")
    private String accountHolderName;

    private String accountType; // SAVINGS, CURRENT

    @PositiveOrZero(message = "Opening balance cannot be negative")
    private BigDecimal openingBalance = BigDecimal.ZERO;
}