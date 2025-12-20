package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.SaleReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleReturnRepository extends JpaRepository<SaleReturn, Long> {
    Optional<SaleReturn> findByReturnNumber(String returnNumber);
    List<SaleReturn> findByCustomerId(Long customerId);
    List<SaleReturn> findByBranchId(Long branchId);
    List<SaleReturn> findByReturnDateBetween(LocalDate startDate, LocalDate endDate);
}