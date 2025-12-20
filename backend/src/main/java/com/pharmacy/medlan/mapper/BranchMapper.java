package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.branch.CreateBranchRequest;
import com.pharmacy.medlan.dto.response.branch.BranchResponse;
import com.pharmacy.medlan.model.organization.Branch;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BranchMapper {

    public BranchResponse toResponse(Branch branch) {
        if (branch == null) {
            return null;
        }

        return BranchResponse.builder()
                .id(branch.getId())
                .branchCode(branch.getBranchCode())
                .branchName(branch.getBranchName())
                .address(branch.getAddress())
                .city(branch.getCity())
                .state(branch.getState())
                .pincode(branch.getPincode())
                .phoneNumber(branch.getPhoneNumber())
                .email(branch.getEmail())
                .gstinNumber(branch.getGstinNumber())
                .drugLicenseNumber(branch.getDrugLicenseNumber())
                .managerId(branch.getManager() != null ? branch.getManager().getId() : null)
                .managerName(branch.getManager() != null ? branch.getManager().getUsername() : null)
                .isActive(branch.getIsActive())
                .isMainBranch(branch.getIsMainBranch())
                .createdAt(branch.getCreatedAt())
                .updatedAt(branch.getUpdatedAt())
                .build();
    }

    public List<BranchResponse> toResponseList(List<Branch> branches) {
        return branches.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Branch toEntity(CreateBranchRequest request) {
        return Branch.builder()
                .branchCode(request.getBranchCode())
                .branchName(request.getBranchName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .gstinNumber(request.getGstinNumber())
                .drugLicenseNumber(request.getDrugLicenseNumber())
                .isMainBranch(request.getIsMainBranch() != null ? request.getIsMainBranch() : false)
                .isActive(true)
                .build();
    }
}
