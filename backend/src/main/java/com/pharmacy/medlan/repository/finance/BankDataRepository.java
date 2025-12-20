package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.model.finance.BankData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BankDataRepository extends JpaRepository<BankData, Long> {
    List<BankData> findByBankId(Long bankId);
    List<BankData> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    List<BankData> findByBankIdAndTransactionDateBetween(Long bankId, LocalDate startDate, LocalDate endDate);
}
