package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Medical Product Entity - represents pharmaceutical/medical items
 */
@Entity
@DiscriminatorValue("MEDICAL")
@Data
@EqualsAndHashCode(callSuper = true)
public class MedicalProduct extends Product {
    
    // Medical-specific fields
    @Column(name = "generic_name", length = 200)
    private String genericName;
    
    @Column(length = 100)
    private String strength;
    
    @Column(name = "dosage_form", length = 50)
    @Enumerated(EnumType.STRING)
    private DosageForm dosageForm;
    
    @Column(name = "drug_schedule", length = 20)
    @Enumerated(EnumType.STRING)
    private DrugSchedule drugSchedule;
    
    @Column(name = "is_narcotic")
    private Boolean isNarcotic;
    
    @Column(name = "is_prescription_required")
    private Boolean isPrescriptionRequired;
    
    @Column(name = "is_refrigerated")
    private Boolean isRefrigerated;
    
    @Override
    public boolean isValid() {
        // Medical products must have these fields
        if (dosageForm == null) {
            return false;
        }
        if (isNarcotic == null || isPrescriptionRequired == null) {
            return false;
        }
        return true;
    }
    
    @Override
    public ProductType getProductType() {
        return ProductType.MEDICAL;
    }
    
    /**
     * Check if this is a controlled substance
     */
    public boolean isControlledSubstance() {
        return Boolean.TRUE.equals(isNarcotic) || 
               (drugSchedule != null && 
                (drugSchedule == DrugSchedule.H || 
                 drugSchedule == DrugSchedule.H1 || 
                 drugSchedule == DrugSchedule.X));
    }
    
    /**
     * Check if refrigeration is required
     */
    public boolean requiresRefrigeration() {
        return Boolean.TRUE.equals(isRefrigerated);
    }
    
    /**
     * Check if prescription is mandatory
     */
    public boolean requiresPrescription() {
        return Boolean.TRUE.equals(isPrescriptionRequired);
    }
}

/**
 * Enum for dosage forms
 */
enum DosageForm {
    TABLET,
    CAPSULE,
    SYRUP,
    INJECTION,
    DROPS,
    CREAM,
    OINTMENT,
    INHALER,
    POWDER,
    SUSPENSION,
    GEL,
    LOTION,
    SPRAY,
    PATCH,
    SUPPOSITORY
}

/**
 * Enum for drug schedules (Indian pharmacy classification)
 */
enum DrugSchedule {
    H,   // Schedule H - prescription required
    H1,  // Schedule H1 - higher control
    X,   // Schedule X - special control
    G,   // General sale
    C,   // Controlled
    C1   // Controlled (higher)
}
