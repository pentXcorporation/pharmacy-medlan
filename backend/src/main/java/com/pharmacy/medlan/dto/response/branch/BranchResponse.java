package com.pharmacy.medlan.dto.response.branch;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {

    private Long id;
    private String branchCode;
    private String branchName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phoneNumber;
    private String email;
    private String gstinNumber;
    private String drugLicenseNumber;
    private Long managerId;
    private String managerName;
    private Boolean isActive;
    private Boolean isMainBranch;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
