package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.CosmeticProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Cosmetic Products
 */
@Repository
public interface CosmeticProductRepository extends JpaRepository<CosmeticProduct, Long> {
    
    List<CosmeticProduct> findByDeletedFalse();
    
    List<CosmeticProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT c FROM CosmeticProduct c WHERE c.deleted = false AND c.skinType = :skinType")
    List<CosmeticProduct> findBySkinType(@Param("skinType") String skinType);
    
    @Query("SELECT c FROM CosmeticProduct c WHERE c.deleted = false AND c.cosmeticCategory = :category")
    List<CosmeticProduct> findByCosmeticCategory(@Param("category") String category);
    
    @Query("SELECT c FROM CosmeticProduct c WHERE c.deleted = false AND c.isParabenFree = true")
    List<CosmeticProduct> findParabenFreeProducts();
    
    @Query("SELECT c FROM CosmeticProduct c WHERE c.deleted = false AND c.isCrueltyFree = true")
    List<CosmeticProduct> findCrueltyFreeProducts();
}
