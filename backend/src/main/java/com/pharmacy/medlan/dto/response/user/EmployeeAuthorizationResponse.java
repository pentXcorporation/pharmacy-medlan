package com.pharmacy.medlan.dto.response.user;

import com.pharmacy.medlan.enums.AuthorizationStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAuthorizationResponse {

    private Long id;
    private String authorizationCode;

    private Long employeeId;
    private String employeeName;
    private String employeeCode;

    private Long authorizedById;
    private String authorizedByName;

    private Long branchId;
    private String branchName;

    private String transactionType;
    private Long transactionReferenceId;
    private BigDecimal amount;

    private String reason;
    private String remarks;

    private AuthorizationStatus status;

    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}