package com.pharmacy.medlan.repository.user;

import com.pharmacy.medlan.model.user.BranchStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchStaffRepository extends JpaRepository<BranchStaff, Long> {
    List<BranchStaff> findByUserId(Long userId);
    List<BranchStaff> findByBranchId(Long branchId);
    List<BranchStaff> findByUserIdAndIsActiveTrue(Long userId);
    Optional<BranchStaff> findByUserIdAndBranchId(Long userId, Long branchId);
    Optional<BranchStaff> findByUserIdAndIsPrimaryBranchTrue(Long userId);
}