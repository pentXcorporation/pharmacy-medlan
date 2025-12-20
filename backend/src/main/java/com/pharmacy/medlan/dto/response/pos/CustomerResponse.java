package com.pharmacy.medlan.dto.response.pos;

import com.pharmacy.medlan.enums.CustomerStatus;
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
public class CustomerResponse {

    private Long id;
    private String customerCode;
    private String customerName;
    private String phoneNumber;
    private String email;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String fax;
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private CustomerStatus status;
    private String description;
    private String medicalHistory;
    private String allergies;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
