package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.ProductPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductPricingRepository extends JpaRepository<ProductPricing, Long> {
    List<ProductPricing> findByProductId(Long productId);

    @Query("SELECT pp FROM ProductPricing pp WHERE pp.product.id = :productId " +
            "AND pp.isCurrent = true")
    Optional<ProductPricing> findCurrentPricingByProduct(Long productId);

    List<ProductPricing> findByProductIdAndEffectiveDateBetween(
            Long productId, LocalDate startDate, LocalDate endDate);
}
