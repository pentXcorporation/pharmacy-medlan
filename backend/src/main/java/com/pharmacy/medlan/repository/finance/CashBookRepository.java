package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.model.finance.CashBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashBookRepository extends JpaRepository<CashBook, Long> {
    List<CashBook> findByBranchId(Long branchId);
    List<CashBook> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    List<CashBook> findByBranchIdAndTransactionDateBetween(Long branchId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT cb FROM CashBook cb WHERE cb.branch.id = :branchId " +
            "ORDER BY cb.transactionDate DESC, cb.id DESC")
    List<CashBook> findLatestByBranch(Long branchId);

    @Query("SELECT SUM(cb.debitAmount) FROM CashBook cb WHERE cb.branch.id = :branchId " +
            "AND cb.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalDebitByBranchAndDate(Long branchId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(cb.creditAmount) FROM CashBook cb WHERE cb.branch.id = :branchId " +
            "AND cb.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalCreditByBranchAndDate(Long branchId, LocalDate startDate, LocalDate endDate);
}
