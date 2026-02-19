package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.payroll.PayrollResponse;
import com.pharmacy.medlan.model.payroll.EmployeePayment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PayrollMapper {

    public PayrollResponse toResponse(EmployeePayment payment) {
        if (payment == null) {
            return null;
        }

        Long employeeId = null;
        String employeeName = payment.getWorkerName(); // safe default

        if (payment.getEmployee() != null) {
            try {
                employeeId = payment.getEmployee().getId();
                employeeName = payment.getEmployee().getFullName();
            } catch (Exception e) {
                // Lazy-loading failure — fall back to denormalized workerName
                log.warn("Could not load Employee for EmployeePayment id={}: {}", payment.getId(), e.getMessage());
            }
        }

        return PayrollResponse.builder()
                .id(payment.getId())
                .branchId(payment.getBranch() != null ? payment.getBranch().getId() : null)
                .employeeId(employeeId)
                .employeeName(employeeName)
                .workerName(payment.getWorkerName())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .reason(payment.getReason())
                .paymentMethod(payment.getPaymentMethod())
                .remarks(payment.getRemarks())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}