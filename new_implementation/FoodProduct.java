package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Food Product Entity - represents food items, beverages, snacks
 */
@Entity
@DiscriminatorValue("FOOD")
@Data
@EqualsAndHashCode(callSuper = true)
public class FoodProduct extends Product {
    
    // Food-specific fields
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    
    @Column(name = "nutritional_info", columnDefinition = "jsonb")
    private String nutritionalInfo;  // Store as JSON: {calories: 100, protein: 5g, etc.}
    
    @Column(name = "allergen_info", columnDefinition = "TEXT")
    private String allergenInfo;
    
    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;
    
    @Column(columnDefinition = "TEXT")
    private String storageInstructions;
    
    @Column(name = "is_organic")
    private Boolean isOrganic;
    
    @Column(name = "is_vegan")
    private Boolean isVegan;
    
    @Column(name = "is_vegetarian")
    private Boolean isVegetarian;
    
    @Column(name = "is_gluten_free")
    private Boolean isGlutenFree;
    
    @Column(name = "fssai_license", length = 100)
    private String fssaiLicense;
    
    @Override
    public boolean isValid() {
        // Food products are valid by default
        // You can add specific validation here
        if (shelfLifeDays != null && shelfLifeDays < 0) {
            return false;
        }
        return true;
    }
    
    @Override
    public ProductType getProductType() {
        return ProductType.FOOD;
    }
    
    /**
     * Check if product is expiring soon based on shelf life
     */
    public boolean isExpiringSoon(int daysThreshold) {
        if (shelfLifeDays == null) {
            return false;
        }
        return shelfLifeDays <= daysThreshold;
    }
    
    /**
     * Check if product has any allergens
     */
    public boolean hasAllergens() {
        return allergenInfo != null && !allergenInfo.trim().isEmpty();
    }
    
    /**
     * Check if suitable for dietary restrictions
     */
    public boolean isSuitableForDiet(String dietType) {
        switch (dietType.toLowerCase()) {
            case "vegan":
                return Boolean.TRUE.equals(isVegan);
            case "vegetarian":
                return Boolean.TRUE.equals(isVegetarian);
            case "gluten-free":
                return Boolean.TRUE.equals(isGlutenFree);
            default:
                return false;
        }
    }
}
