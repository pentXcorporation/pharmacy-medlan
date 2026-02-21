package com.pharmacy.medlan.repository.payroll;

import com.pharmacy.medlan.model.payroll.EmployeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeePaymentRepository extends JpaRepository<EmployeePayment, Long> {
    List<EmployeePayment> findByEmployeeId(Long employeeId);
    List<EmployeePayment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(ep.amount) FROM EmployeePayment ep WHERE ep.employee.id = :employeeId " +
            "AND ep.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPaymentsByEmployeeAndDate(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    // Branch isolation methods
    List<EmployeePayment> findByBranchId(Long branchId);
    List<EmployeePayment> findByBranchIdAndEmployeeId(Long branchId, Long employeeId);
    List<EmployeePayment> findByBranchIdAndPaymentDateBetween(Long branchId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(ep.amount) FROM EmployeePayment ep WHERE ep.branch.id = :branchId " +
            "AND ep.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPaymentsByBranchAndDate(Long branchId, LocalDate startDate, LocalDate endDate);
}
