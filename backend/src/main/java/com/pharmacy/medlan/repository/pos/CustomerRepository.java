package com.pharmacy.medlan.repository.pos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.enums.CustomerStatus;
import com.pharmacy.medlan.model.pos.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    Optional<Customer> findByCustomerCode(String customerCode);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    Optional<Customer> findByEmail(String email);

    List<Customer> findByStatus(CustomerStatus status);

    List<Customer> findByCity(String city);

    List<Customer> findByState(String state);

    @Query("SELECT c FROM Customer c WHERE " +
            "(LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Customer> searchCustomers(@Param("search") String search);

    @Query("SELECT c FROM Customer c WHERE c.status = 'ACTIVE' " +
            "AND c.currentBalance > 0 ORDER BY c.currentBalance DESC")
    List<Customer> findCustomersWithOutstandingBalance();

    @Query("SELECT c FROM Customer c WHERE c.status = 'ACTIVE' " +
            "AND c.currentBalance >= c.creditLimit AND c.creditLimit > 0")
    List<Customer> findCustomersExceedingCreditLimit();

    @Query("SELECT SUM(c.currentBalance) FROM Customer c WHERE c.status = 'ACTIVE'")
    BigDecimal getTotalOutstandingBalance();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = 'ACTIVE'")
    Long countActiveCustomers();

    @Query("SELECT c FROM Customer c WHERE c.dateOfBirth = :date")
    List<Customer> findCustomersWithBirthday(@Param("date") LocalDate date);

    @Query("SELECT c FROM Customer c WHERE c.insuranceProvider IS NOT NULL " +
            "AND c.insurancePolicyNumber IS NOT NULL")
    List<Customer> findCustomersWithInsurance();

    @Query("SELECT c FROM Customer c WHERE c.allergies IS NOT NULL " +
            "AND c.allergies <> ''")
    List<Customer> findCustomersWithAllergies();

    @Query("SELECT c FROM Customer c JOIN c.sales s " +
            "WHERE s.saleDate BETWEEN :startDate AND :endDate " +
            "GROUP BY c ORDER BY COUNT(s) DESC")
    List<Customer> findTopCustomersByPurchaseFrequency(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT c FROM Customer c JOIN c.sales s " +
            "WHERE s.saleDate BETWEEN :startDate AND :endDate " +
            "GROUP BY c ORDER BY SUM(s.totalAmount) DESC")
    List<Customer> findTopCustomersByPurchaseAmount(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    boolean existsByCustomerCode(String customerCode);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
}
