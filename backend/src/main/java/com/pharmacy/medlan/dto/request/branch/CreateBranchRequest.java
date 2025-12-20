package com.pharmacy.medlan.dto.request.branch;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBranchRequest {

    @NotBlank(message = "Branch code is required")
    @Size(max = 50, message = "Branch code cannot exceed 50 characters")
    private String branchCode;

    @NotBlank(message = "Branch name is required")
    @Size(max = 200, message = "Branch name cannot exceed 200 characters")
    private String branchName;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State cannot exceed 100 characters")
    private String state;

    @Size(max = 20, message = "Pincode cannot exceed 20 characters")
    private String pincode;

    @Size(max = 50, message = "Phone number cannot exceed 50 characters")
    private String phoneNumber;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 50, message = "GSTIN number cannot exceed 50 characters")
    private String gstinNumber;

    @Size(max = 50, message = "Drug license number cannot exceed 50 characters")
    private String drugLicenseNumber;

    private Long managerId;

    private Boolean isMainBranch = false;
}
