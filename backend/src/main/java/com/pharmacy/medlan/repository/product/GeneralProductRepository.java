package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.GeneralProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for General Products
 */
@Repository
public interface GeneralProductRepository extends JpaRepository<GeneralProduct, Long> {
    
    List<GeneralProduct> findByDeletedFalse();
    
    List<GeneralProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT g FROM GeneralProduct g WHERE g.deleted = false AND g.productCategory = :category")
    List<GeneralProduct> findByProductCategory(@Param("category") String category);
}
