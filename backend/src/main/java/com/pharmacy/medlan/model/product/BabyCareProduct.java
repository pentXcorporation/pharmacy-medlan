package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Baby Care Product Entity
 * Represents diapers, baby food, wipes, oils, powders, etc.
 */
@Entity
@DiscriminatorValue("BABY_CARE")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class BabyCareProduct extends Product {

    @Column(name = "age_range", length = 100)
    private String ageRange; // "0-6 months", "6-12 months", "1-2 years", etc.

    @Column(name = "product_sub_type", length = 100)
    private String productSubType; // Diaper, Food, Oil, Powder, Wipes, etc.

    @Column(name = "size", length = 50)
    private String size; // S, M, L, XL (for diapers/clothing)

    @Column(name = "is_hypoallergenic")
    private Boolean isHypoallergenic;

    @Column(name = "is_dermatologically_tested")
    private Boolean isDermatologicallyTested;

    @Column(name = "is_fragrance_free")
    private Boolean isFragranceFree;

    @Column(name = "pack_quantity")
    private Integer packQuantity; // Number of pieces in pack (e.g., 60 diapers)

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Override
    public boolean isValid() {
        // Baby care products should have age range and product sub-type
        return this.ageRange != null && !this.ageRange.trim().isEmpty();
    }

    @Override
    public ProductType getProductType() {
        return ProductType.BABY_CARE;
    }

    /**
     * Check if suitable for sensitive skin
     */
    public boolean isSuitableForSensitiveSkin() {
        return Boolean.TRUE.equals(this.isHypoallergenic) || 
               Boolean.TRUE.equals(this.isDermatologicallyTested);
    }

    /**
     * Get age range description
     */
    public String getAgeRangeDescription() {
        if (ageRange != null) {
            return String.format("Suitable for babies/children aged %s", ageRange);
        }
        return "See product details for age suitability";
    }

    /**
     * Get pack size description
     */
    public String getPackDescription() {
        if (packQuantity != null && packQuantity > 0) {
            return String.format("Pack of %d pieces", packQuantity);
        }
        return "Single unit";
    }
}
