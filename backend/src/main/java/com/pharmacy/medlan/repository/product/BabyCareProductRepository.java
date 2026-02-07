package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.BabyCareProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Baby Care Products
 */
@Repository
public interface BabyCareProductRepository extends JpaRepository<BabyCareProduct, Long> {
    
    List<BabyCareProduct> findByDeletedFalse();
    
    List<BabyCareProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT b FROM BabyCareProduct b WHERE b.deleted = false AND b.ageRange = :ageRange")
    List<BabyCareProduct> findByAgeRange(@Param("ageRange") String ageRange);
    
    @Query("SELECT b FROM BabyCareProduct b WHERE b.deleted = false AND b.productSubType = :subType")
    List<BabyCareProduct> findByProductSubType(@Param("subType") String subType);
    
    @Query("SELECT b FROM BabyCareProduct b WHERE b.deleted = false AND b.isHypoallergenic = true")
    List<BabyCareProduct> findHypoallergenicProducts();
}
