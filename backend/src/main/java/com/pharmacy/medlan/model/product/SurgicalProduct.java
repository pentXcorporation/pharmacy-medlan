package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Surgical Product Entity
 * Represents surgical items and first aid supplies
 */
@Entity
@DiscriminatorValue("SURGICAL")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class SurgicalProduct extends Product {

    @Column(name = "sterilized")
    private Boolean sterilized;

    @Column(name = "single_use")
    private Boolean singleUse; // Disposable or reusable

    @Column(name = "material", length = 200)
    private String material; // Cotton, Gauze, Latex, etc.

    @Column(name = "size", length = 100)
    private String size; // Dimensions or size category

    @Column(name = "pack_size")
    private Integer packSize; // Number of pieces in pack

    @Column(name = "surgical_category", length = 100)
    private String surgicalCategory; // Bandage, Gauze, Cotton, Surgical Instrument, etc.

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Column(name = "is_latex_free")
    private Boolean isLatexFree;

    @Column(name = "sterilization_method", length = 100)
    private String sterilizationMethod; // Gamma, ETO, Steam, etc.

    @Override
    public boolean isValid() {
        // Surgical products should specify if they're sterilized and single use
        return this.sterilized != null && this.singleUse != null;
    }

    @Override
    public ProductType getProductType() {
        return ProductType.SURGICAL;
    }

    /**
     * Check if product is safe for latex allergies
     */
    public boolean isSafeForLatexAllergies() {
        return Boolean.TRUE.equals(this.isLatexFree);
    }

    /**
     * Get sterilization information
     */
    public String getSterilizationInfo() {
        if (Boolean.TRUE.equals(sterilized)) {
            String method = sterilizationMethod != null ? 
                          String.format(" (Method: %s)", sterilizationMethod) : "";
            return "Sterilized" + method;
        }
        return "Non-sterile";
    }

    /**
     * Get usage type description
     */
    public String getUsageTypeDescription() {
        if (Boolean.TRUE.equals(singleUse)) {
            return "Single-use disposable";
        }
        return "Reusable (requires sterilization)";
    }

    /**
     * Get pack information
     */
    public String getPackInfo() {
        if (packSize != null && packSize > 0) {
            return String.format("Pack of %d pieces", packSize);
        }
        return "Single unit";
    }
}
