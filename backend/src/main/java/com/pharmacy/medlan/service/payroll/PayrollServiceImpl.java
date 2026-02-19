package com.pharmacy.medlan.service.payroll;

import com.pharmacy.medlan.dto.request.payroll.CreatePayrollRequest;
import com.pharmacy.medlan.dto.response.payroll.PayrollResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.PayrollMapper;
import com.pharmacy.medlan.model.payroll.EmployeePayment;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.payroll.EmployeePaymentRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollServiceImpl implements PayrollService {

    private final EmployeePaymentRepository employeePaymentRepository;
    private final UserRepository userRepository;
    private final PayrollMapper payrollMapper;
    private final BranchRepository branchRepository;

    /**
     * Validates that the branch exists and is active
     */
    private Branch validateBranch(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));
        
        if (!branch.getIsActive()) {
            throw new IllegalStateException("Branch with id " + branchId + " is not active");
        }
        
        return branch;
    }

    @Override
    @Transactional
    public PayrollResponse create(CreatePayrollRequest request) {
        log.info("Creating payroll for user ID: {} at branch {}", request.getEmployeeId(), request.getBranchId());
        
        // Validate branch
        Branch branch = validateBranch(request.getBranchId());
        
        User user = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getEmployeeId()));

        EmployeePayment payment = EmployeePayment.builder()
                .employee(user)
                .branch(branch)
                .workerName(request.getWorkerName())
                .paymentDate(request.getPaymentDate())
                .amount(request.getAmount())
                .reason(request.getReason())
                .paymentMethod(request.getPaymentMethod())
                .remarks(request.getRemarks())
                .build();

        EmployeePayment savedPayment = employeePaymentRepository.save(payment);
        log.info("Payroll created successfully with ID: {}", savedPayment.getId());
        
        return payrollMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional
    public PayrollResponse update(Long id, CreatePayrollRequest request) {
        log.info("Updating payroll with ID: {}", id);
        
        EmployeePayment payment = employeePaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));

        // Validate branch
        Branch branch = validateBranch(request.getBranchId());
        
        User user = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getEmployeeId()));

        payment.setEmployee(user);
        payment.setBranch(branch);
        payment.setWorkerName(request.getWorkerName());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(request.getAmount());
        payment.setReason(request.getReason());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setRemarks(request.getRemarks());

        EmployeePayment updatedPayment = employeePaymentRepository.save(payment);
        log.info("Payroll updated successfully");
        
        return payrollMapper.toResponse(updatedPayment);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting payroll with ID: {}", id);
        
        if (!employeePaymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found with ID: " + id);
        }
        
        employeePaymentRepository.deleteById(id);
        log.info("Payroll deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollResponse getById(Long id) {
        log.info("Fetching payroll with ID: {}", id);
        
        EmployeePayment payment = employeePaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
        
        return payrollMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PayrollResponse> getAll(Pageable pageable) {
        log.info("Fetching all payroll records with pagination");
        
        Page<EmployeePayment> payments = employeePaymentRepository.findAll(pageable);
        return payments.map(payrollMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getByEmployeeId(Long employeeId) {
        log.info("Fetching payroll for employee ID: {}", employeeId);
        
        List<EmployeePayment> payments = employeePaymentRepository.findByEmployeeId(employeeId);
        return payments.stream()
                .map(payrollMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching payroll between {} and {}", startDate, endDate);
        
        List<EmployeePayment> payments = employeePaymentRepository.findByPaymentDateBetween(startDate, endDate);
        return payments.stream()
                .map(payrollMapper::toResponse)
                .collect(Collectors.toList());
    }
}
