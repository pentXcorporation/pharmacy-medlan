package com.pharmacy.medlan.repository.inventory;

import com.pharmacy.medlan.model.inventory.StockTransfer;
import com.pharmacy.medlan.enums.StockTransferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> {
    Optional<StockTransfer> findByTransferNumber(String transferNumber);
    List<StockTransfer> findByFromBranchId(Long fromBranchId);
    List<StockTransfer> findByToBranchId(Long toBranchId);
    List<StockTransfer> findByStatus(StockTransferStatus status);

    @Query("SELECT st FROM StockTransfer st WHERE st.fromBranch.id = :branchId " +
            "OR st.toBranch.id = :branchId")
    List<StockTransfer> findByBranch(Long branchId);

    List<StockTransfer> findByTransferDateBetween(LocalDate startDate, LocalDate endDate);
}