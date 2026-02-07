package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Cosmetic Product Entity - represents beauty and personal care items
 */
@Entity
@DiscriminatorValue("COSMETIC")
@Data
@EqualsAndHashCode(callSuper = true)
public class CosmeticProduct extends Product {
    
    @Column(name = "skin_type", length = 100)
    private String skinType;  // All, Oily, Dry, Combination, Sensitive
    
    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;
    
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    
    @Column(name = "dermatologically_tested")
    private Boolean dermatologicallyTested;
    
    @Column(name = "is_paraben_free")
    private Boolean isParabenFree;
    
    @Column(name = "is_cruelty_free")
    private Boolean isCrueltyFree;
    
    @Column(name = "spf_rating")
    private Integer spfRating;  // For sunscreens
    
    @Column(name = "fragrance_type", length = 100)
    private String fragranceType;
    
    @Column(name = "expiry_months_after_opening")
    private Integer expiryMonthsAfterOpening;
    
    @Override
    public boolean isValid() {
        return true;
    }
    
    @Override
    public ProductType getProductType() {
        return ProductType.COSMETIC;
    }
    
    /**
     * Check if suitable for skin type
     */
    public boolean isSuitableForSkinType(String userSkinType) {
        if (skinType == null || skinType.equalsIgnoreCase("All")) {
            return true;
        }
        return skinType.equalsIgnoreCase(userSkinType);
    }
    
    /**
     * Check if product is natural/organic
     */
    public boolean isNaturalProduct() {
        return Boolean.TRUE.equals(isParabenFree) && 
               Boolean.TRUE.equals(isCrueltyFree);
    }
}

/**
 * Supplement Product Entity - represents vitamins, minerals, health supplements
 */
@Entity
@DiscriminatorValue("SUPPLEMENT")
@Data
@EqualsAndHashCode(callSuper = true)
class SupplementProduct extends Product {
    
    @Column(name = "supplement_type", length = 100)
    private String supplementType;  // Vitamin, Mineral, Protein, Herbal, etc.
    
    @Column(columnDefinition = "TEXT")
    private String activeIngredients;
    
    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;
    
    @Column(name = "serving_size", length = 100)
    private String servingSize;
    
    @Column(name = "servings_per_container")
    private Integer servingsPerContainer;
    
    @Column(name = "age_group", length = 100)
    private String ageGroup;  // Adults, Children, Seniors, All
    
    @Column(name = "is_fda_approved")
    private Boolean isFdaApproved;
    
    @Column(name = "warnings", columnDefinition = "TEXT")
    private String warnings;
    
    @Override
    public boolean isValid() {
        return true;
    }
    
    @Override
    public ProductType getProductType() {
        return ProductType.SUPPLEMENT;
    }
    
    /**
     * Check if suitable for age group
     */
    public boolean isSuitableForAge(String ageCategory) {
        if (ageGroup == null || ageGroup.equalsIgnoreCase("All")) {
            return true;
        }
        return ageGroup.equalsIgnoreCase(ageCategory);
    }
}

/**
 * General Product Entity - for items that don't fit other categories
 */
@Entity
@DiscriminatorValue("GENERAL")
@Data
@EqualsAndHashCode(callSuper = true)
class GeneralProduct extends Product {
    
    @Column(name = "product_category_name", length = 100)
    private String productCategoryName;  // Medical Equipment, First Aid, etc.
    
    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;
    
    @Column(name = "warranty_months")
    private Integer warrantyMonths;
    
    @Column(name = "is_returnable")
    private Boolean isReturnable;
    
    @Override
    public boolean isValid() {
        return true;
    }
    
    @Override
    public ProductType getProductType() {
        return ProductType.GENERAL;
    }
    
    /**
     * Check if product is under warranty
     */
    public boolean hasWarranty() {
        return warrantyMonths != null && warrantyMonths > 0;
    }
}

/**
 * Product Type Enum
 */
enum ProductType {
    MEDICAL("Medical/Pharmaceutical"),
    FOOD("Food & Beverages"),
    COSMETIC("Cosmetics & Personal Care"),
    SUPPLEMENT("Supplements & Vitamins"),
    GENERAL("General Items");
    
    private final String displayName;
    
    ProductType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
