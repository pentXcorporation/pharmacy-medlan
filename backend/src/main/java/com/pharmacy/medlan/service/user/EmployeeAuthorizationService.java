package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.enums.AuthorizationStatus;
import com.pharmacy.medlan.model.user.EmployeeAuthorization;

import java.math.BigDecimal;
import java.util.List;

public interface EmployeeAuthorizationService {

    EmployeeAuthorization requestAuthorization(Long employeeId, Long branchId, String transactionType,
                                                Long transactionReferenceId, BigDecimal amount, String reason);

    EmployeeAuthorization approveAuthorization(Long authorizationId, Long authorizedByUserId, String remarks);

    EmployeeAuthorization rejectAuthorization(Long authorizationId, Long authorizedByUserId, String remarks);

    EmployeeAuthorization getById(Long id);

    EmployeeAuthorization getByAuthorizationCode(String authorizationCode);

    List<EmployeeAuthorization> getByEmployee(Long employeeId);

    List<EmployeeAuthorization> getByStatus(AuthorizationStatus status);

    List<EmployeeAuthorization> getByBranch(Long branchId);

    List<EmployeeAuthorization> getPendingByBranch(Long branchId);

    boolean validateAuthorizationCode(String authorizationCode);
}
