package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.FoodProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Food Products
 */
@Repository
public interface FoodProductRepository extends JpaRepository<FoodProduct, Long> {
    
    List<FoodProduct> findByDeletedFalse();
    
    List<FoodProduct> findByIsActiveTrueAndDeletedFalse();
    
    @Query("SELECT f FROM FoodProduct f WHERE f.deleted = false AND f.isOrganic = true")
    List<FoodProduct> findOrganicFoodProducts();
    
    @Query("SELECT f FROM FoodProduct f WHERE f.deleted = false AND f.isVegan = true")
    List<FoodProduct> findVeganFoodProducts();
    
    @Query("SELECT f FROM FoodProduct f WHERE f.deleted = false AND f.isGlutenFree = true")
    List<FoodProduct> findGlutenFreeFoodProducts();
    
    @Query("SELECT f FROM FoodProduct f WHERE f.deleted = false AND f.foodCategory = :category")
    List<FoodProduct> findByFoodCategory(@Param("category") String category);
}
