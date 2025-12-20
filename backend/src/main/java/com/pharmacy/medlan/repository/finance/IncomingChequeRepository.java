package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.model.finance.IncomingCheque;
import com.pharmacy.medlan.enums.ChequeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomingChequeRepository extends JpaRepository<IncomingCheque, Long> {
    Optional<IncomingCheque> findByChequeNumber(String chequeNumber);
    List<IncomingCheque> findByStatus(ChequeStatus status);
    List<IncomingCheque> findByBankId(Long bankId);
    List<IncomingCheque> findByCustomerId(Long customerId);
    List<IncomingCheque> findBySupplierId(Long supplierId);
    List<IncomingCheque> findByChequeDateBetween(LocalDate startDate, LocalDate endDate);
    List<IncomingCheque> findByDepositDateBetween(LocalDate startDate, LocalDate endDate);
}