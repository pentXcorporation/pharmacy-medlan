package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.enums.AuthorizationStatus;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.EmployeeAuthorization;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.user.EmployeeAuthorizationRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class EmployeeAuthorizationServiceImpl implements EmployeeAuthorizationService {

    private final EmployeeAuthorizationRepository authorizationRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    public EmployeeAuthorization requestAuthorization(Long employeeId, Long branchId, String transactionType,
                                                       Long transactionReferenceId, BigDecimal amount, String reason) {
        log.info("Requesting authorization for employee {} at branch {}", employeeId, branchId);

        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        EmployeeAuthorization authorization = EmployeeAuthorization.builder()
                .employee(employee)
                .branch(branch)
                .transactionType(transactionType)
                .transactionReferenceId(transactionReferenceId)
                .authorizationCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .amount(amount)
                .reason(reason)
                .status(AuthorizationStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        return authorizationRepository.save(authorization);
    }

    @Override
    public EmployeeAuthorization approveAuthorization(Long authorizationId, Long authorizedByUserId, String remarks) {
        EmployeeAuthorization auth = getById(authorizationId);
        if (auth.getStatus() != AuthorizationStatus.PENDING) {
            throw new BusinessRuleViolationException("Authorization is not in PENDING status");
        }

        User authorizedBy = userRepository.findById(authorizedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorizedByUserId));

        auth.setStatus(AuthorizationStatus.APPROVED);
        auth.setAuthorizedBy(authorizedBy);
        auth.setRespondedAt(LocalDateTime.now());
        auth.setRemarks(remarks);

        return authorizationRepository.save(auth);
    }

    @Override
    public EmployeeAuthorization rejectAuthorization(Long authorizationId, Long authorizedByUserId, String remarks) {
        EmployeeAuthorization auth = getById(authorizationId);
        if (auth.getStatus() != AuthorizationStatus.PENDING) {
            throw new BusinessRuleViolationException("Authorization is not in PENDING status");
        }

        User authorizedBy = userRepository.findById(authorizedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorizedByUserId));

        auth.setStatus(AuthorizationStatus.REJECTED);
        auth.setAuthorizedBy(authorizedBy);
        auth.setRespondedAt(LocalDateTime.now());
        auth.setRemarks(remarks);

        return authorizationRepository.save(auth);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeAuthorization getById(Long id) {
        return authorizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Authorization not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeAuthorization getByAuthorizationCode(String authorizationCode) {
        return authorizationRepository.findByAuthorizationCode(authorizationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Authorization not found with code: " + authorizationCode));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAuthorization> getByEmployee(Long employeeId) {
        return authorizationRepository.findByEmployeeId(employeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAuthorization> getByStatus(AuthorizationStatus status) {
        return authorizationRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAuthorization> getByBranch(Long branchId) {
        return authorizationRepository.findByBranchId(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAuthorization> getPendingByBranch(Long branchId) {
        return authorizationRepository.findByBranchIdAndStatus(branchId, AuthorizationStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateAuthorizationCode(String authorizationCode) {
        return authorizationRepository.findByAuthorizationCode(authorizationCode)
                .map(auth -> auth.getStatus() == AuthorizationStatus.APPROVED)
                .orElse(false);
    }
}
