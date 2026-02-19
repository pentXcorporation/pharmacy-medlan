package com.pharmacy.medlan.service.branch;

import com.pharmacy.medlan.model.user.BranchStaff;

import java.util.List;

public interface BranchStaffService {

    BranchStaff assignStaffToBranch(Long userId, Long branchId, String designation, String employmentType);

    BranchStaff updateStaffAssignment(Long id, String designation, Boolean isActive);

    void removeStaffFromBranch(Long userId, Long branchId);

    List<BranchStaff> getStaffByBranch(Long branchId);

    List<BranchStaff> getStaffByUser(Long userId);

    List<BranchStaff> getActiveStaffByUser(Long userId);

    BranchStaff getPrimaryBranch(Long userId);

    void setPrimaryBranch(Long userId, Long branchId);
}
