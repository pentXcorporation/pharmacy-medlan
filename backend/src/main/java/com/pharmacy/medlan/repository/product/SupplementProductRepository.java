package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.SupplementProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Supplement Products
 */
@Repository
public interface SupplementProductRepository extends JpaRepository<SupplementProduct, Long> {
    
    List<SupplementProduct> findByDeletedFalse();
    
    List<SupplementProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT s FROM SupplementProduct s WHERE s.deleted = false AND s.supplementType = :type")
    List<SupplementProduct> findBySupplementType(@Param("type") String type);
    
    @Query("SELECT s FROM SupplementProduct s WHERE s.deleted = false AND s.isFdaApproved = true")
    List<SupplementProduct> findFdaApprovedSupplements();
    
    @Query("SELECT s FROM SupplementProduct s WHERE s.deleted = false AND s.isCertifiedOrganic = true")
    List<SupplementProduct> findOrganicSupplements();
}
