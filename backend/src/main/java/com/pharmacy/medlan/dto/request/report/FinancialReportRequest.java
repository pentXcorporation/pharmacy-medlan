package com.pharmacy.medlan.dto.request.report;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialReportRequest {

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Long branchId;

    private String reportType;

    private Boolean includeExpenses;

    private Boolean includeSales;

    private Boolean includePurchases;

    private Boolean includePayroll;
}
