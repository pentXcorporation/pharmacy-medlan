package com.pharmacy.medlan.dto.request.user;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizeEmployeeRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotBlank(message = "Transaction type is required")
    @Size(max = 100, message = "Transaction type cannot exceed 100 characters")
    private String transactionType; // DISCOUNT, CREDIT_SALE, VOID, PRICE_OVERRIDE

    private Long transactionReferenceId;

    private BigDecimal amount;

    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;

    private String remarks;
}