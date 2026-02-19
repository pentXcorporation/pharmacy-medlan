package com.pharmacy.medlan.dto.response.auth;

import com.pharmacy.medlan.enums.Role;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String employeeCode;
    private BigDecimal discountLimit;
    private BigDecimal creditTransactionLimit;
    private Long branchId;
    private String branchName;
    private Boolean isActive;
    private LocalDateTime lastLoginTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}