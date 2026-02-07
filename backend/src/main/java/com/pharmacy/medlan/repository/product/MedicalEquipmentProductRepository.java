package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.MedicalEquipmentProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Medical Equipment Products
 */
@Repository
public interface MedicalEquipmentProductRepository extends JpaRepository<MedicalEquipmentProduct, Long> {
    
    List<MedicalEquipmentProduct> findByDeletedFalse();
    
    List<MedicalEquipmentProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT m FROM MedicalEquipmentProduct m WHERE m.deleted = false AND m.equipmentType = :type")
    List<MedicalEquipmentProduct> findByEquipmentType(@Param("type") String type);
    
    @Query("SELECT m FROM MedicalEquipmentProduct m WHERE m.deleted = false AND m.requiresCalibration = true")
    List<MedicalEquipmentProduct> findEquipmentRequiringCalibration();
    
    @Query("SELECT m FROM MedicalEquipmentProduct m WHERE m.deleted = false AND m.isCertified = true")
    List<MedicalEquipmentProduct> findCertifiedEquipment();
}
