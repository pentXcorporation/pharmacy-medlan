package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.response.payroll.PayrollResponse;
import com.pharmacy.medlan.model.payroll.EmployeePayment;
import org.springframework.stereotype.Component;

@Component
public class PayrollMapper {

    public PayrollResponse toResponse(EmployeePayment payment) {
        if (payment == null) {
            return null;
        }

        // Handle lazy loading of employee
        String employeeName = "Unknown";
        Long employeeId = null;
        try {
            if (payment.getEmployee() != null) {
                employeeId = payment.getEmployee().getId();
                employeeName = payment.getEmployee().getFullName();
            }
        } catch (Exception e) {
            // Lazy loading exception, use workerName as fallback
            employeeName = payment.getWorkerName();
        }

        return PayrollResponse.builder()
                .id(payment.getId())
                .branchId(payment.getBranchId())
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
