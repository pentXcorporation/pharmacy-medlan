package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.MedicalProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Medical Products
 */
@Repository
public interface MedicalProductRepository extends JpaRepository<MedicalProduct, Long> {
    
    List<MedicalProduct> findByDeletedFalse();
    
    List<MedicalProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT m FROM MedicalProduct m WHERE m.deleted = false AND m.isNarcotic = true")
    List<MedicalProduct> findNarcoticProducts();
    
    @Query("SELECT m FROM MedicalProduct m WHERE m.deleted = false AND m.isPrescriptionRequired = true")
    List<MedicalProduct> findPrescriptionProducts();
    
    @Query("SELECT m FROM MedicalProduct m WHERE m.deleted = false AND m.isRefrigerated = true")
    List<MedicalProduct> findRefrigeratedProducts();
    
    @Query("SELECT m FROM MedicalProduct m WHERE m.deleted = false AND m.drugSchedule = :schedule")
    List<MedicalProduct> findByDrugSchedule(@Param("schedule") com.pharmacy.medlan.enums.DrugSchedule schedule);
}
