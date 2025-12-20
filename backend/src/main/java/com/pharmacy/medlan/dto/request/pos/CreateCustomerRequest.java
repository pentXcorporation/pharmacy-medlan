package com.pharmacy.medlan.dto.request.pos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerRequest {

    @NotBlank(message = "Customer name is required")
    @Size(max = 200, message = "Customer name must not exceed 200 characters")
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

    private String description;

    private String medicalHistory;

    private String allergies;

    private String insuranceProvider;

    private String insurancePolicyNumber;
}
