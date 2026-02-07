package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Ayurvedic Product Entity
 * Represents traditional Indian medicine and herbal products
 */
@Entity
@DiscriminatorValue("AYURVEDIC")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class AyurvedicProduct extends Product {

    @Column(name = "ayurvedic_type", length = 100)
    private String ayurvedicType; // Classical, Patent, Proprietary

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients; // Herbal ingredients

    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;

    @Column(name = "ayush_license", length = 100)
    private String ayushLicense; // AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy) license

    @Column(name = "contraindications", columnDefinition = "TEXT")
    private String contraindications;

    @Column(name = "therapeutic_uses", columnDefinition = "TEXT")
    private String therapeuticUses; // Health benefits and uses

    @Column(name = "preparation_method", length = 200)
    private String preparationMethod; // Kashayam, Churnam, Tailam, etc.

    @Column(name = "is_classical_formulation")
    private Boolean isClassicalFormulation; // Based on ancient texts

    @Override
    public boolean isValid() {
        // Ayurvedic products should have AYUSH license
        if (this.ayushLicense == null || this.ayushLicense.trim().isEmpty()) {
            return false;
        }
        return this.ayurvedicType != null && !this.ayurvedicType.trim().isEmpty();
    }

    @Override
    public ProductType getProductType() {
        return ProductType.AYURVEDIC;
    }

    /**
     * Check if this is a classical formulation
     */
    public boolean isClassicalAyurvedicFormulation() {
        return Boolean.TRUE.equals(this.isClassicalFormulation);
    }

    /**
     * Get formulation type description
     */
    public String getFormulationDescription() {
        if (ayurvedicType != null) {
            return switch (ayurvedicType.toLowerCase()) {
                case "classical" -> "Classical Ayurvedic formulation based on ancient texts";
                case "patent" -> "Patent Ayurvedic medicine";
                case "proprietary" -> "Proprietary Ayurvedic formulation";
                default -> ayurvedicType;
            };
        }
        return "Ayurvedic medicine";
    }

    /**
     * Get AYUSH license information
     */
    public String getLicenseInfo() {
        if (ayushLicense != null && !ayushLicense.trim().isEmpty()) {
            return String.format("AYUSH License: %s", ayushLicense);
        }
        return "AYUSH license information not available";
    }
}
