package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Food Product Entity
 * Represents health drinks, baby food, nutrition products, etc.
 */
@Entity
@DiscriminatorValue("FOOD")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class FoodProduct extends Product {

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    @Column(name = "nutritional_info", columnDefinition = "TEXT")
    private String nutritionalInfo; // JSON string for flexible nutrition data

    @Column(name = "allergen_info", columnDefinition = "TEXT")
    private String allergenInfo; // e.g., "Contains milk, soy, nuts"

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "is_organic")
    private Boolean isOrganic;

    @Column(name = "is_vegan")
    private Boolean isVegan;

    @Column(name = "is_vegetarian")
    private Boolean isVegetarian;

    @Column(name = "is_gluten_free")
    private Boolean isGlutenFree;

    @Column(name = "fssai_license", length = 100)
    private String fssaiLicense; // Food Safety and Standards Authority of India license

    @Column(name = "food_category", length = 100)
    private String foodCategory; // Health Drink, Baby Food, Nutrition, etc.

    @Override
    public boolean isValid() {
        // Food products must have FSSAI license and shelf life
        if (this.fssaiLicense == null || this.fssaiLicense.trim().isEmpty()) {
            return false;
        }
        if (this.shelfLifeDays == null || this.shelfLifeDays <= 0) {
            return false;
        }
        return true;
    }

    @Override
    public ProductType getProductType() {
        return ProductType.FOOD;
    }

    /**
     * Check if product has allergens
     */
    public boolean hasAllergens() {
        return this.allergenInfo != null && !this.allergenInfo.trim().isEmpty();
    }

    /**
     * Check if product is suitable for specific dietary requirements
     */
    public boolean isSuitableForDiet(String dietaryRequirement) {
        return switch (dietaryRequirement.toLowerCase()) {
            case "vegan" -> Boolean.TRUE.equals(this.isVegan);
            case "vegetarian" -> Boolean.TRUE.equals(this.isVegetarian);
            case "gluten-free" -> Boolean.TRUE.equals(this.isGlutenFree);
            default -> true;
        };
    }

    /**
     * Get expiry date from manufacture in days
     */
    public String getShelfLifeDescription() {
        if (shelfLifeDays != null) {
            int months = shelfLifeDays / 30;
            return String.format("%d days (approx. %d months) from manufacture", shelfLifeDays, months);
        }
        return "See product label";
    }
}
