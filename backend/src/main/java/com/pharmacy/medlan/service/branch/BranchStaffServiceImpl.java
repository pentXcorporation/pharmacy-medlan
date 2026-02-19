package com.pharmacy.medlan.service.branch;

import com.pharmacy.medlan.enums.EmploymentType;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.BranchStaff;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.user.BranchStaffRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BranchStaffServiceImpl implements BranchStaffService {

    private final BranchStaffRepository branchStaffRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    public BranchStaff assignStaffToBranch(Long userId, Long branchId, String designation, String employmentType) {
        log.info("Assigning user {} to branch {}", userId, branchId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        branchStaffRepository.findByUserIdAndBranchId(userId, branchId)
                .ifPresent(existing -> {
                    throw new BusinessRuleViolationException("User is already assigned to this branch");
                });

        boolean hasPrimary = branchStaffRepository.findByUserIdAndIsPrimaryBranchTrue(userId).isPresent();

        BranchStaff branchStaff = BranchStaff.builder()
                .user(user)
                .branch(branch)
                .designation(designation)
                .employmentType(EmploymentType.valueOf(employmentType))
                .joiningDate(LocalDate.now())
                .isPrimaryBranch(!hasPrimary)
                .isActive(true)
                .build();

        return branchStaffRepository.save(branchStaff);
    }

    @Override
    public BranchStaff updateStaffAssignment(Long id, String designation, Boolean isActive) {
        BranchStaff staff = branchStaffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch staff assignment not found with id: " + id));

        if (designation != null) staff.setDesignation(designation);
        if (isActive != null) {
            staff.setIsActive(isActive);
            if (!isActive) staff.setLeavingDate(LocalDate.now());
        }

        return branchStaffRepository.save(staff);
    }

    @Override
    public void removeStaffFromBranch(Long userId, Long branchId) {
        BranchStaff staff = branchStaffRepository.findByUserIdAndBranchId(userId, branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff assignment not found"));
        staff.setIsActive(false);
        staff.setLeavingDate(LocalDate.now());
        branchStaffRepository.save(staff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchStaff> getStaffByBranch(Long branchId) {
        return branchStaffRepository.findByBranchId(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchStaff> getStaffByUser(Long userId) {
        return branchStaffRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchStaff> getActiveStaffByUser(Long userId) {
        return branchStaffRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchStaff getPrimaryBranch(Long userId) {
        return branchStaffRepository.findByUserIdAndIsPrimaryBranchTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No primary branch found for user: " + userId));
    }

    @Override
    public void setPrimaryBranch(Long userId, Long branchId) {
        branchStaffRepository.findByUserIdAndIsPrimaryBranchTrue(userId)
                .ifPresent(staff -> {
                    staff.setIsPrimaryBranch(false);
                    branchStaffRepository.save(staff);
                });

        BranchStaff staff = branchStaffRepository.findByUserIdAndBranchId(userId, branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff assignment not found"));
        staff.setIsPrimaryBranch(true);
        branchStaffRepository.save(staff);
    }
}
