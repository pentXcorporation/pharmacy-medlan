package com.pharmacy.medlan.dto.request.user;

import com.pharmacy.medlan.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(max = 200, message = "Full name must not exceed 200 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;

    private Role role;

    private Boolean isActive;

    private BigDecimal discountLimit;

    private BigDecimal creditTransactionLimit;
}
