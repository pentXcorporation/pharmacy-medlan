package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Medical/Pharmaceutical Product Entity
 * Represents prescription and OTC medicines
 */
@Entity
@DiscriminatorValue("MEDICAL")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MedicalProduct extends Product {

    @Override
    public boolean isValid() {
        // Medical products must have dosage form, drug schedule, and prescription requirement
        if (this.getDosageForm() == null) {
            return false;
        }
        if (this.getDrugSchedule() == null) {
            return false;
        }
        if (this.getIsPrescriptionRequired() == null) {
            return false;
        }
        if (this.getIsNarcotic() == null) {
            return false;
        }
        if (this.getIsRefrigerated() == null) {
            return false;
        }
        return true;
    }

    @Override
    public ProductType getProductType() {
        return ProductType.MEDICAL;
    }

    /**
     * Check if this is a controlled substance (Schedule H, H1, or X)
     */
    public boolean isControlledSubstance() {
        DrugSchedule schedule = this.getDrugSchedule();
        return schedule == DrugSchedule.H || 
               schedule == DrugSchedule.H1 || 
               schedule == DrugSchedule.X;
    }

    /**
     * Check if this product qualifies for life-saving drug GST exemption
     * Life-saving drugs (Schedule H, H1, X) may have 0% or 5% GST
     */
    public boolean isLifeSavingDrug() {
        return isControlledSubstance() && Boolean.TRUE.equals(this.getIsPrescriptionRequired());
    }

    /**
     * Get recommended storage temperature
     */
    public String getStorageRequirement() {
        if (Boolean.TRUE.equals(this.getIsRefrigerated())) {
            return "Store between 2-8°C (Refrigerated)";
        }
        return "Store below 30°C in a cool, dry place";
    }
}
