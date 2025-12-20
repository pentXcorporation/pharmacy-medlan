package com.pharmacy.medlan.repository.inventory;

import com.pharmacy.medlan.model.inventory.ExpiryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpiryDataRepository extends JpaRepository<ExpiryData, Long> {
    List<ExpiryData> findByProductId(Long productId);
    List<ExpiryData> findByExpiryDateBefore(LocalDate date);
    List<ExpiryData> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
}
