package com.pharmacy.medlan.repository.user;

import com.pharmacy.medlan.model.user.EmployeeAuthorization;
import com.pharmacy.medlan.enums.AuthorizationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeAuthorizationRepository extends JpaRepository<EmployeeAuthorization, Long> {
    List<EmployeeAuthorization> findByEmployeeId(Long employeeId);
    List<EmployeeAuthorization> findByStatus(AuthorizationStatus status);
    Optional<EmployeeAuthorization> findByAuthorizationCode(String authorizationCode);
    List<EmployeeAuthorization> findByEmployeeIdAndStatus(Long employeeId, AuthorizationStatus status);
    
    // Branch isolation methods
    List<EmployeeAuthorization> findByBranchId(Long branchId);
    List<EmployeeAuthorization> findByBranchIdAndStatus(Long branchId, AuthorizationStatus status);
    List<EmployeeAuthorization> findByBranchIdAndEmployeeId(Long branchId, Long employeeId);
}