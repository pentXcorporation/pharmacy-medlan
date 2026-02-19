package com.pharmacy.medlan.dto.request.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryTransactionRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotNull(message = "Transaction type is required")
    private TransactionType transactionType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    private String reason;
}
