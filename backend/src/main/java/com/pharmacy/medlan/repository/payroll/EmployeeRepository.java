package com.pharmacy.medlan.repository.payroll;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.enums.EmploymentType;
import com.pharmacy.medlan.model.payroll.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    List<Employee> findByIsActiveTrue();

    List<Employee> findByIsActiveFalse();

    List<Employee> findByEmploymentType(EmploymentType employmentType);

    List<Employee> findByDesignation(String designation);

    @Query("SELECT e FROM Employee e WHERE " +
            "(LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.designation) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Employee> searchEmployees(@Param("search") String search);

    @Query("SELECT e FROM Employee e WHERE e.joiningDate BETWEEN :startDate AND :endDate")
    List<Employee> findByJoiningDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT e FROM Employee e WHERE e.leavingDate BETWEEN :startDate AND :endDate")
    List<Employee> findByLeavingDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.basicSalary) FROM Employee e WHERE e.isActive = true")
    BigDecimal getTotalBasicSalary();

    @Query("SELECT SUM(e.basicSalary + e.allowances) FROM Employee e WHERE e.isActive = true")
    BigDecimal getTotalPayroll();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.isActive = true")
    Long countActiveEmployees();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.employmentType = :type AND e.isActive = true")
    Long countByEmploymentType(@Param("type") EmploymentType type);

    @Query("SELECT DISTINCT e.designation FROM Employee e WHERE e.isActive = true")
    List<String> findAllDesignations();

    @Query("SELECT e FROM Employee e WHERE e.isActive = true " +
            "AND MONTH(e.joiningDate) = :month AND DAY(e.joiningDate) = :day")
    List<Employee> findEmployeesWithWorkAnniversary(
            @Param("month") int month,
            @Param("day") int day);

    boolean existsByEmployeeCode(String employeeCode);
}