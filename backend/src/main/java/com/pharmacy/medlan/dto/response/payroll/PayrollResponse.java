package com.pharmacy.medlan.dto.response.payroll;

import com.pharmacy.medlan.enums.PaymentMethod;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {
    private Long id;
    private Long branchId;
    private Long employeeId;
    private String employeeName;
    private String workerName;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String reason;
    private PaymentMethod paymentMethod;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
