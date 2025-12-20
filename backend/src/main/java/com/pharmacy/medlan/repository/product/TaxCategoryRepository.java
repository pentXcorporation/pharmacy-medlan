package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.TaxCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaxCategoryRepository extends JpaRepository<TaxCategory, Long> {
    Optional<TaxCategory> findByTaxName(String taxName);
    List<TaxCategory> findByIsActiveTrue();
}