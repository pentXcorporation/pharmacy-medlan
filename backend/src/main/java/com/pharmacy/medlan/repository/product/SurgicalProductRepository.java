package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.SurgicalProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Surgical Products
 */
@Repository
public interface SurgicalProductRepository extends JpaRepository<SurgicalProduct, Long> {
    
    List<SurgicalProduct> findByDeletedFalse();
    
    List<SurgicalProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT s FROM SurgicalProduct s WHERE s.deleted = false AND s.sterilized = true")
    List<SurgicalProduct> findSterilizedProducts();
    
    @Query("SELECT s FROM SurgicalProduct s WHERE s.deleted = false AND s.singleUse = true")
    List<SurgicalProduct> findDisposableProducts();
    
    @Query("SELECT s FROM SurgicalProduct s WHERE s.deleted = false AND s.surgicalCategory = :category")
    List<SurgicalProduct> findBySurgicalCategory(@Param("category") String category);
    
    @Query("SELECT s FROM SurgicalProduct s WHERE s.deleted = false AND s.isLatexFree = true")
    List<SurgicalProduct> findLatexFreeProducts();
}
