package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.enums.CashRegisterStatus;
import com.pharmacy.medlan.model.finance.CashRegister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {

    /**
     * Find cash register by branch and date
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.branch.id = :branchId AND cr.registerDate = :date")
    Optional<CashRegister> findByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    /**
     * Find open cash register for a branch
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.branch.id = :branchId AND cr.status = 'OPEN' ORDER BY cr.registerDate DESC")
    Optional<CashRegister> findOpenRegisterByBranch(@Param("branchId") Long branchId);

    /**
     * Find all cash registers by branch
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.branch.id = :branchId ORDER BY cr.registerDate DESC")
    Page<CashRegister> findAllByBranch(@Param("branchId") Long branchId, Pageable pageable);

    /**
     * Find cash registers by branch and date range
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.branch.id = :branchId AND cr.registerDate BETWEEN :startDate AND :endDate ORDER BY cr.registerDate DESC")
    List<CashRegister> findByBranchAndDateRange(@Param("branchId") Long branchId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find cash registers by status
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.status = :status ORDER BY cr.registerDate DESC")
    Page<CashRegister> findAllByStatus(@Param("status") CashRegisterStatus status, Pageable pageable);

    /**
     * Find cash registers by branch and status
     */
    @Query("SELECT cr FROM CashRegister cr WHERE cr.branch.id = :branchId AND cr.status = :status ORDER BY cr.registerDate DESC")
    List<CashRegister> findByBranchAndStatus(@Param("branchId") Long branchId, @Param("status") CashRegisterStatus status);

    /**
     * Get total sales for a date range
     */
    @Query("SELECT COALESCE(SUM(cr.salesTotal), 0) FROM CashRegister cr WHERE cr.branch.id = :branchId AND cr.registerDate BETWEEN :startDate AND :endDate")
    java.math.BigDecimal getTotalSalesByBranchAndDateRange(@Param("branchId") Long branchId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
