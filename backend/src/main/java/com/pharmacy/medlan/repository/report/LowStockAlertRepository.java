package com.pharmacy.medlan.repository.report;

import com.pharmacy.medlan.model.report.LowStockAlert;
import com.pharmacy.medlan.enums.AlertLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LowStockAlertRepository extends JpaRepository<LowStockAlert, Long> {
    List<LowStockAlert> findByProductId(Long productId);
    List<LowStockAlert> findByBranchId(Long branchId);
    List<LowStockAlert> findByAlertLevel(AlertLevel alertLevel);
    List<LowStockAlert> findByIsAcknowledgedFalse();

    @Query("SELECT lsa FROM LowStockAlert lsa WHERE lsa.branch.id = :branchId " +
            "AND lsa.isAcknowledged = false ORDER BY lsa.alertLevel DESC, lsa.alertGeneratedAt ASC")
    List<LowStockAlert> findUnacknowledgedAlertsByBranch(Long branchId);
}