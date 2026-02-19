package com.pharmacy.medlan.dto.response.branch;

import com.pharmacy.medlan.enums.EmploymentType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchStaffResponse {

    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String employeeCode;
    private Long branchId;
    private String branchName;
    private String designation;
    private EmploymentType employmentType;
    private LocalDate joiningDate;
    private LocalDate leavingDate;
    private Boolean isPrimaryBranch;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}