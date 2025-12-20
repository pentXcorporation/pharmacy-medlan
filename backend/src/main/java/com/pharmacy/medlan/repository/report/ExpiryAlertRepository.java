package com.pharmacy.medlan.repository.report;

import com.pharmacy.medlan.model.report.ExpiryAlert;
import com.pharmacy.medlan.enums.AlertLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpiryAlertRepository extends JpaRepository<ExpiryAlert, Long> {
    List<ExpiryAlert> findByProductId(Long productId);
    List<ExpiryAlert> findByBranchId(Long branchId);
    List<ExpiryAlert> findByAlertLevel(AlertLevel alertLevel);
    List<ExpiryAlert> findByIsAcknowledgedFalse();
    List<ExpiryAlert> findByExpiryDateBefore(LocalDate date);

    @Query("SELECT ea FROM ExpiryAlert ea WHERE ea.branch.id = :branchId " +
            "AND ea.isAcknowledged = false ORDER BY ea.expiryDate ASC, ea.alertLevel DESC")
    List<ExpiryAlert> findUnacknowledgedAlertsByBranch(Long branchId);

    @Query("SELECT ea FROM ExpiryAlert ea WHERE ea.branch.id = :branchId " +
            "AND ea.expiryDate BETWEEN :startDate AND :endDate")
    List<ExpiryAlert> findByBranchAndExpiryDateRange(Long branchId, LocalDate startDate, LocalDate endDate);
}
