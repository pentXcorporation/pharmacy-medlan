package com.pharmacy.repository;

import com.pharmacy.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Base Product Repository - works with all product types
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find by product code
    Optional<Product> findByProductCodeAndDeletedFalse(String productCode);
    
    // Find by barcode
    Optional<Product> findByBarcodeAndDeletedFalse(String barcode);
    
    // Find active products
    List<Product> findByIsActiveTrueAndDeletedFalse();
    
    // Find by category
    List<Product> findByCategoryIdAndDeletedFalse(Long categoryId);
    
    // Search by name
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%')) AND p.deleted = false")
    List<Product> searchByName(@Param("name") String name);
    
    // Find products below reorder level
    @Query("SELECT p FROM Product p JOIN BranchInventory bi ON p.id = bi.product.id " +
           "WHERE bi.quantityOnHand <= p.reorderLevel AND p.deleted = false AND bi.branch.id = :branchId")
    List<Product> findProductsBelowReorderLevel(@Param("branchId") Long branchId);
    
    // Find by price range
    @Query("SELECT p FROM Product p WHERE p.sellingPrice BETWEEN :minPrice AND :maxPrice AND p.deleted = false")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
}

/**
 * Medical Product Repository - specific queries for medical products
 */
@Repository
public interface MedicalProductRepository extends JpaRepository<MedicalProduct, Long> {
    
    // Find by dosage form
    List<MedicalProduct> findByDosageFormAndDeletedFalse(DosageForm dosageForm);
    
    // Find by drug schedule
    List<MedicalProduct> findByDrugScheduleAndDeletedFalse(DrugSchedule schedule);
    
    // Find prescription-required products
    List<MedicalProduct> findByIsPrescriptionRequiredTrueAndDeletedFalse();
    
    // Find narcotic products
    List<MedicalProduct> findByIsNarcoticTrueAndDeletedFalse();
    
    // Find refrigerated products
    List<MedicalProduct> findByIsRefrigeratedTrueAndDeletedFalse();
    
    // Find by generic name
    @Query("SELECT mp FROM MedicalProduct mp WHERE LOWER(mp.genericName) LIKE LOWER(CONCAT('%', :genericName, '%')) AND mp.deleted = false")
    List<MedicalProduct> searchByGenericName(@Param("genericName") String genericName);
    
    // Find controlled substances
    @Query("SELECT mp FROM MedicalProduct mp WHERE " +
           "(mp.isNarcotic = true OR mp.drugSchedule IN ('H', 'H1', 'X')) " +
           "AND mp.deleted = false")
    List<MedicalProduct> findControlledSubstances();
}

/**
 * Food Product Repository - specific queries for food products
 */
@Repository
public interface FoodProductRepository extends JpaRepository<FoodProduct, Long> {
    
    // Find products expiring soon
    @Query("SELECT fp FROM FoodProduct fp WHERE fp.shelfLifeDays <= :days AND fp.deleted = false")
    List<FoodProduct> findExpiringSoon(@Param("days") Integer days);
    
    // Find organic products
    List<FoodProduct> findByIsOrganicTrueAndDeletedFalse();
    
    // Find vegan products
    List<FoodProduct> findByIsVeganTrueAndDeletedFalse();
    
    // Find vegetarian products
    List<FoodProduct> findByIsVegetarianTrueAndDeletedFalse();
    
    // Find gluten-free products
    List<FoodProduct> findByIsGlutenFreeTrueAndDeletedFalse();
    
    // Search by ingredients
    @Query("SELECT fp FROM FoodProduct fp WHERE LOWER(fp.ingredients) LIKE LOWER(CONCAT('%', :ingredient, '%')) AND fp.deleted = false")
    List<FoodProduct> searchByIngredient(@Param("ingredient") String ingredient);
    
    // Find products with allergen info
    @Query("SELECT fp FROM FoodProduct fp WHERE fp.allergenInfo IS NOT NULL AND fp.allergenInfo != '' AND fp.deleted = false")
    List<FoodProduct> findProductsWithAllergens();
}

/**
 * Cosmetic Product Repository - specific queries for cosmetic products
 */
@Repository
public interface CosmeticProductRepository extends JpaRepository<CosmeticProduct, Long> {
    
    // Find by skin type
    List<CosmeticProduct> findBySkinTypeAndDeletedFalse(String skinType);
    
    // Find paraben-free products
    List<CosmeticProduct> findByIsParabenFreeTrueAndDeletedFalse();
    
    // Find cruelty-free products
    List<CosmeticProduct> findByIsCrueltyFreeTrueAndDeletedFalse();
    
    // Find dermatologically tested
    List<CosmeticProduct> findByDermatologicallyTestedTrueAndDeletedFalse();
    
    // Find sunscreens with minimum SPF
    @Query("SELECT cp FROM CosmeticProduct cp WHERE cp.spfRating >= :minSpf AND cp.deleted = false")
    List<CosmeticProduct> findSunscreensWithMinSpf(@Param("minSpf") Integer minSpf);
    
    // Find natural products
    @Query("SELECT cp FROM CosmeticProduct cp WHERE cp.isParabenFree = true AND cp.isCrueltyFree = true AND cp.deleted = false")
    List<CosmeticProduct> findNaturalProducts();
}

/**
 * Supplement Product Repository - specific queries for supplements
 */
@Repository
public interface SupplementProductRepository extends JpaRepository<SupplementProduct, Long> {
    
    // Find by supplement type
    List<SupplementProduct> findBySupplementTypeAndDeletedFalse(String supplementType);
    
    // Find by age group
    List<SupplementProduct> findByAgeGroupAndDeletedFalse(String ageGroup);
    
    // Find FDA approved
    List<SupplementProduct> findByIsFdaApprovedTrueAndDeletedFalse();
    
    // Search by active ingredients
    @Query("SELECT sp FROM SupplementProduct sp WHERE LOWER(sp.activeIngredients) LIKE LOWER(CONCAT('%', :ingredient, '%')) AND sp.deleted = false")
    List<SupplementProduct> searchByActiveIngredient(@Param("ingredient") String ingredient);
}

/**
 * General Product Repository
 */
@Repository
public interface GeneralProductRepository extends JpaRepository<GeneralProduct, Long> {
    
    // Find returnable products
    List<GeneralProduct> findByIsReturnableTrueAndDeletedFalse();
    
    // Find products with warranty
    @Query("SELECT gp FROM GeneralProduct gp WHERE gp.warrantyMonths > 0 AND gp.deleted = false")
    List<GeneralProduct> findProductsWithWarranty();
}
