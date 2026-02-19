package com.pharmacy.medlan.dto.request.report;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportRequest {

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Long branchId;

    private Long customerId;

    private Long productId;

    private Long categoryId;

    private String reportType; // SUMMARY, DETAILED, BY_PRODUCT, BY_CUSTOMER

    private String groupBy; // DAILY, WEEKLY, MONTHLY

    private Boolean includeReturns;

    private Boolean includeDiscounts;
}