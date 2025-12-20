package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.CustomerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerDataRepository extends JpaRepository<CustomerData, Long> {
    List<CustomerData> findByCustomerId(Long customerId);
    List<CustomerData> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
}
