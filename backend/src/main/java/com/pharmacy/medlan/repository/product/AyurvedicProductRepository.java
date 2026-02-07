package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.AyurvedicProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Ayurvedic Products
 */
@Repository
public interface AyurvedicProductRepository extends JpaRepository<AyurvedicProduct, Long> {
    
    List<AyurvedicProduct> findByDeletedFalse();
    
    List<AyurvedicProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT a FROM AyurvedicProduct a WHERE a.deleted = false AND a.ayurvedicType = :type")
    List<AyurvedicProduct> findByAyurvedicType(@Param("type") String type);
    
    @Query("SELECT a FROM AyurvedicProduct a WHERE a.deleted = false AND a.isClassicalFormulation = true")
    List<AyurvedicProduct> findClassicalFormulations();
    
    @Query("SELECT a FROM AyurvedicProduct a WHERE a.deleted = false AND a.preparationMethod = :method")
    List<AyurvedicProduct> findByPreparationMethod(@Param("method") String method);
}
