package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Homeopathic Product Entity
 * Represents homeopathic medicines and remedies
 */
@Entity
@DiscriminatorValue("HOMEOPATHIC")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class HomeopathicProduct extends Product {

    @Column(name = "potency", length = 50)
    private String potency; // 6CH, 30CH, 200CH, 1M, etc.

    @Column(name = "mother_tincture", length = 200)
    private String motherTincture; // Q or Mother tincture name

    @Column(name = "indications", columnDefinition = "TEXT")
    private String indications; // Medical conditions/symptoms

    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;

    @Column(name = "form", length = 100)
    private String form; // Dilution, Tablet, Globules, Mother Tincture, etc.

    @Column(name = "homeopathic_pharmacopoeia", length = 200)
    private String homeopathicPharmacopoeia; // Reference to standard pharmacopoeia

    @Column(name = "is_combination_remedy")
    private Boolean isCombinationRemedy; // Single remedy vs combination

    @Override
    public boolean isValid() {
        // Homeopathic products should have potency (except mother tinctures)
        if (form != null && form.equalsIgnoreCase("Mother Tincture")) {
            return motherTincture != null && !motherTincture.trim().isEmpty();
        }
        return potency != null && !potency.trim().isEmpty();
    }

    @Override
    public ProductType getProductType() {
        return ProductType.HOMEOPATHIC;
    }

    /**
     * Check if this is a mother tincture
     */
    public boolean isMotherTincture() {
        return form != null && form.equalsIgnoreCase("Mother Tincture");
    }

    /**
     * Check if high potency (200CH and above)
     */
    public boolean isHighPotency() {
        if (potency == null) {
            return false;
        }
        // Check for common high potencies
        return potency.matches(".*[2-9][0-9]{2}.*|.*[1-9]M.*|.*10M.*|.*50M.*|.*CM.*");
    }

    /**
     * Get potency description
     */
    public String getPotencyDescription() {
        if (isMotherTincture()) {
            return "Mother Tincture (Q) - Base preparation";
        }
        if (potency != null) {
            if (isHighPotency()) {
                return String.format("High potency: %s - For chronic/deep-seated conditions", potency);
            } else {
                return String.format("Potency: %s - For acute conditions", potency);
            }
        }
        return "Potency information not available";
    }

    /**
     * Get remedy type description
     */
    public String getRemedyTypeDescription() {
        if (Boolean.TRUE.equals(isCombinationRemedy)) {
            return "Combination remedy - Multiple homeopathic medicines";
        }
        return "Single remedy - Single homeopathic medicine";
    }
}
