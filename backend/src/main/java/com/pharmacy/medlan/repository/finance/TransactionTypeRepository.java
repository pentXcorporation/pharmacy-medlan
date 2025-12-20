package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.model.finance.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionType, Long> {
    Optional<TransactionType> findByTypeName(String typeName);
    List<TransactionType> findByIsIncome(Boolean isIncome);
    List<TransactionType> findByIsActiveTrue();
}