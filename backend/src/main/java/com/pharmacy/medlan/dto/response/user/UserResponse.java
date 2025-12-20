package com.pharmacy.medlan.dto.response.user;

import com.pharmacy.medlan.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private Boolean isActive;
    private LocalDate lastLoginDate;
    private BigDecimal discountLimit;
    private BigDecimal creditTransactionLimit;
    private String employeeCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
