package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.model.finance.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BankRepository extends JpaRepository<Bank, Long>, JpaSpecificationExecutor<Bank> {

    Optional<Bank> findByAccountNumber(String accountNumber);

    Optional<Bank> findByBankNameAndBranchName(String bankName, String branchName);

    List<Bank> findByIsActiveTrue();

    List<Bank> findByIsActiveFalse();

    List<Bank> findByBankName(String bankName);

    List<Bank> findByAccountType(String accountType);

    @Query("SELECT b FROM Bank b WHERE " +
            "(LOWER(b.bankName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.accountNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.branchName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Bank> searchBanks(@Param("search") String search);

    @Query("SELECT SUM(b.currentBalance) FROM Bank b WHERE b.isActive = true")
    BigDecimal getTotalBankBalance();

    @Query("SELECT COALESCE(SUM(b.currentBalance), 0) FROM Bank b WHERE b.isActive = true")
    BigDecimal calculateTotalBalance();

    @Query("SELECT b FROM Bank b WHERE b.isActive = true AND b.currentBalance > 0 " +
            "ORDER BY b.currentBalance DESC")
    List<Bank> findBanksWithPositiveBalance();

    @Query("SELECT COUNT(b) FROM Bank b WHERE b.isActive = true")
    Long countActiveBanks();

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByIfscCode(String ifscCode);
}
