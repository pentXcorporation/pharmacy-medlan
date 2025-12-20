package com.pharmacy.medlan.repository.report;

import com.pharmacy.medlan.model.report.DailySalesSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySalesSummaryRepository extends JpaRepository<DailySalesSummary, Long> {
    Optional<DailySalesSummary> findByBranchIdAndSummaryDate(Long branchId, LocalDate summaryDate);
    List<DailySalesSummary> findByBranchId(Long branchId);
    List<DailySalesSummary> findBySummaryDateBetween(LocalDate startDate, LocalDate endDate);
    List<DailySalesSummary> findByBranchIdAndSummaryDateBetween(Long branchId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(dss.totalSalesAmount) FROM DailySalesSummary dss " +
            "WHERE dss.branch.id = :branchId AND dss.summaryDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalSalesByBranchAndDateRange(Long branchId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(dss.totalProfit) FROM DailySalesSummary dss " +
            "WHERE dss.branch.id = :branchId AND dss.summaryDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalProfitByBranchAndDateRange(Long branchId, LocalDate startDate, LocalDate endDate);
}