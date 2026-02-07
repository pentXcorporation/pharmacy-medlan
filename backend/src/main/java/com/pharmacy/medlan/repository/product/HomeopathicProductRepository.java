package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.HomeopathicProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Homeopathic Products
 */
@Repository
public interface HomeopathicProductRepository extends JpaRepository<HomeopathicProduct, Long> {
    
    List<HomeopathicProduct> findByDeletedFalse();
    
    List<HomeopathicProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT h FROM HomeopathicProduct h WHERE h.deleted = false AND h.potency = :potency")
    List<HomeopathicProduct> findByPotency(@Param("potency") String potency);
    
    @Query("SELECT h FROM HomeopathicProduct h WHERE h.deleted = false AND h.form = :form")
    List<HomeopathicProduct> findByForm(@Param("form") String form);
    
    @Query("SELECT h FROM HomeopathicProduct h WHERE h.deleted = false AND h.isCombinationRemedy = true")
    List<HomeopathicProduct> findCombinationRemedies();
    
    @Query("SELECT h FROM HomeopathicProduct h WHERE h.deleted = false AND h.form = 'Mother Tincture'")
    List<HomeopathicProduct> findMotherTinctures();
}
