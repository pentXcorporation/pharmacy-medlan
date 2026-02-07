package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Supplement Product Entity
 * Represents vitamins, minerals, proteins, and herbal supplements
 */
@Entity
@DiscriminatorValue("SUPPLEMENT")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SupplementProduct extends Product {

    @Column(name = "supplement_type", length = 100)
    private String supplementType; // Vitamin, Mineral, Protein, Herbal, etc.

    @Column(name = "active_ingredients", columnDefinition = "TEXT")
    private String activeIngredients;

    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;

    @Column(name = "serving_size", length = 100)
    private String servingSize; // e.g., "1 tablet", "2 capsules"

    @Column(name = "servings_per_container")
    private Integer servingsPerContainer;

    @Column(name = "age_group", length = 100)
    private String ageGroup; // Adults, Children, Seniors, All

    @Column(name = "warnings", columnDefinition = "TEXT")
    private String warnings;

    @Column(name = "is_fda_approved")
    private Boolean isFdaApproved;

    @Column(name = "is_certified_organic")
    private Boolean isCertifiedOrganic;

    @Override
    public boolean isValid() {
        // Supplements should have supplement type and serving information
        return this.supplementType != null && !this.supplementType.trim().isEmpty();
    }

    @Override
    public ProductType getProductType() {
        return ProductType.SUPPLEMENT;
    }

    /**
     * Check if suitable for specific age group
     */
    public boolean isSuitableForAgeGroup(String userAgeGroup) {
        if (this.ageGroup == null || this.ageGroup.equalsIgnoreCase("All")) {
            return true;
        }
        return this.ageGroup.equalsIgnoreCase(userAgeGroup);
    }

    /**
     * Get daily dosage from serving information
     */
    public String getDailyDosageInfo() {
        if (servingSize != null && servingsPerContainer != null) {
            return String.format("%s per day (Total: %d servings)", servingSize, servingsPerContainer);
        }
        return "See dosage instructions";
    }
}
