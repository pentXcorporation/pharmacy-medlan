package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransactionResponse {
    private Long id;
    private String transactionNumber;
    private Long productId;
    private String productName;
    private String productCode;
    private Long branchId;
    private String branchName;
    private TransactionType transactionType;
    private Integer quantity;
    private LocalDateTime transactionDate;
    private String reason;
    private Boolean isApproved;
    private String approvedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
