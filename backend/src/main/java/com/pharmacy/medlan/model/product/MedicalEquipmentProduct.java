package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Medical Equipment Product Entity
 * Represents diagnostic and therapeutic devices
 */
@Entity
@DiscriminatorValue("MEDICAL_EQUIPMENT")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MedicalEquipmentProduct extends Product {

    @Column(name = "equipment_type", length = 100)
    private String equipmentType; // Diagnostic, Therapeutic, Monitoring, etc.

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    @Column(name = "requires_calibration")
    private Boolean requiresCalibration;

    @Column(name = "calibration_frequency_days")
    private Integer calibrationFrequencyDays; // How often calibration is needed

    @Column(name = "power_source", length = 100)
    private String powerSource; // Battery, Electric, Manual

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications; // Technical specifications

    @Column(name = "brand_model", length = 200)
    private String brandModel;

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Column(name = "is_certified")
    private Boolean isCertified; // FDA/CE/ISO certified

    @Column(name = "certification_number", length = 100)
    private String certificationNumber;

    @Override
    public boolean isValid() {
        // Medical equipment should have equipment type
        return this.equipmentType != null && !this.equipmentType.trim().isEmpty();
    }

    @Override
    public ProductType getProductType() {
        return ProductType.MEDICAL_EQUIPMENT;
    }

    /**
     * Check if equipment needs calibration
     */
    public boolean needsCalibration() {
        return Boolean.TRUE.equals(this.requiresCalibration);
    }

    /**
     * Get warranty information
     */
    public String getWarrantyInfo() {
        if (warrantyMonths != null && warrantyMonths > 0) {
            int years = warrantyMonths / 12;
            int months = warrantyMonths % 12;
            if (years > 0 && months > 0) {
                return String.format("%d year(s) and %d month(s) warranty", years, months);
            } else if (years > 0) {
                return String.format("%d year(s) warranty", years);
            } else {
                return String.format("%d month(s) warranty", months);
            }
        }
        return "No warranty information available";
    }

    /**
     * Get calibration requirement description
     */
    public String getCalibrationRequirement() {
        if (Boolean.TRUE.equals(requiresCalibration) && calibrationFrequencyDays != null) {
            int months = calibrationFrequencyDays / 30;
            return String.format("Requires calibration every %d days (approx. %d months)", 
                               calibrationFrequencyDays, months);
        }
        return "No calibration required";
    }
}
