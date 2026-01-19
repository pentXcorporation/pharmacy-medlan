package com.pharmacy.medlan.dto.response.finance;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankResponse {
    private Long id;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String branchName;
    private String accountHolderName;
    private String accountType;
    private BigDecimal currentBalance;
    private BigDecimal openingBalance;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
