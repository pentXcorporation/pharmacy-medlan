package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Cosmetic Product Entity
 * Represents beauty and personal care items
 */
@Entity
@DiscriminatorValue("COSMETIC")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class CosmeticProduct extends Product {

    @Column(name = "skin_type", length = 100)
    private String skinType; // All, Oily, Dry, Combination, Sensitive

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    @Column(name = "dermatologically_tested")
    private Boolean dermatologicallyTested;

    @Column(name = "is_paraben_free")
    private Boolean isParabenFree;

    @Column(name = "is_cruelty_free")
    private Boolean isCrueltyFree;

    @Column(name = "spf_rating")
    private Integer spfRating; // For sunscreens

    @Column(name = "fragrance_type", length = 100)
    private String fragranceType;

    @Column(name = "expiry_months_after_opening")
    private Integer expiryMonthsAfterOpening;

    @Column(name = "cosmetic_category", length = 100)
    private String cosmeticCategory; // Skincare, Haircare, Personal Hygiene, etc.

    @Override
    public boolean isValid() {
        // Basic validation - cosmetics should have a category
        return true; // No mandatory fields for cosmetics
    }

    @Override
    public ProductType getProductType() {
        return ProductType.COSMETIC;
    }

    /**
     * Check if suitable for skin type
     */
    public boolean isSuitableForSkinType(String userSkinType) {
        if (this.skinType == null || this.skinType.equalsIgnoreCase("All")) {
            return true;
        }
        return this.skinType.equalsIgnoreCase(userSkinType);
    }

    /**
     * Check if product is natural/organic
     */
    public boolean isNaturalProduct() {
        return Boolean.TRUE.equals(this.isParabenFree) && 
               Boolean.TRUE.equals(this.isCrueltyFree);
    }

    /**
     * Get sun protection information
     */
    public String getSunProtectionInfo() {
        if (spfRating != null && spfRating > 0) {
            return String.format("SPF %d - Protects against UV rays", spfRating);
        }
        return "No SPF rating";
    }

    /**
     * Get expiry information after opening
     */
    public String getExpiryAfterOpeningInfo() {
        if (expiryMonthsAfterOpening != null && expiryMonthsAfterOpening > 0) {
            return String.format("Use within %d months after opening", expiryMonthsAfterOpening);
        }
        return "See product label for expiry information";
    }
}
