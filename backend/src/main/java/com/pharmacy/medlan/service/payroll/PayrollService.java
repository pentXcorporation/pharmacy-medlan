package com.pharmacy.medlan.service.payroll;

import com.pharmacy.medlan.dto.request.payroll.CreatePayrollRequest;
import com.pharmacy.medlan.dto.response.payroll.PayrollResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface PayrollService {
    PayrollResponse create(CreatePayrollRequest request);
    PayrollResponse update(Long id, CreatePayrollRequest request);
    void delete(Long id);
    PayrollResponse getById(Long id);
    Page<PayrollResponse> getAll(Pageable pageable);
    List<PayrollResponse> getByEmployeeId(Long employeeId);
    List<PayrollResponse> getByDateRange(LocalDate startDate, LocalDate endDate);
}
