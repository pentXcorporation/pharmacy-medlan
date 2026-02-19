package com.pharmacy.medlan.dto.request.report;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryReportRequest {

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Long branchId;

    private Long categoryId;

    private Long productId;

    private String reportType; // STOCK_SUMMARY, EXPIRY, LOW_STOCK, VALUATION

    private Boolean includeExpired;

    private Boolean includeZeroStock;

    private Integer daysToExpiryThreshold; // For expiry reports
}