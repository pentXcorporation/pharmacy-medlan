package com.pharmacy.medlan.repository.finance;

import com.pharmacy.medlan.enums.CashRegisterTransactionType;
import com.pharmacy.medlan.model.finance.CashRegisterTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CashRegisterTransactionRepository extends JpaRepository<CashRegisterTransaction, Long> {

    /**
     * Find all transactions by cash register
     */
    @Query("SELECT t FROM CashRegisterTransaction t WHERE t.cashRegister.id = :registerId ORDER BY t.timestamp DESC")
    List<CashRegisterTransaction> findAllByRegisterId(@Param("registerId") Long registerId);

    /**
     * Find transactions by cash register and type
     */
    @Query("SELECT t FROM CashRegisterTransaction t WHERE t.cashRegister.id = :registerId AND t.type = :type ORDER BY t.timestamp DESC")
    List<CashRegisterTransaction> findByRegisterIdAndType(@Param("registerId") Long registerId, @Param("type") CashRegisterTransactionType type);

    /**
     * Get total amount by cash register and type
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashRegisterTransaction t WHERE t.cashRegister.id = :registerId AND t.type = :type")
    BigDecimal getTotalAmountByRegisterAndType(@Param("registerId") Long registerId, @Param("type") CashRegisterTransactionType type);

    /**
     * Count transactions by cash register
     */
    @Query("SELECT COUNT(t) FROM CashRegisterTransaction t WHERE t.cashRegister.id = :registerId")
    Long countByRegisterId(@Param("registerId") Long registerId);
}
