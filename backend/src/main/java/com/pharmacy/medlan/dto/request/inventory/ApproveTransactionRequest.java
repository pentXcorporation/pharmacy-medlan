package com.pharmacy.medlan.dto.request.inventory;

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
public class ApproveTransactionRequest {

    @NotNull(message = "Approval decision is required")
    private Boolean approved;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;
}
