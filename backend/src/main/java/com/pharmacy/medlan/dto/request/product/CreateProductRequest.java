package com.pharmacy.medlan.dto.request.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import com.pharmacy.medlan.enums.ProductType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotNull(message = "Product type is required")
    private ProductType productType;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String productName;

    @Size(max = 200, message = "Generic name must not exceed 200 characters")
    private String genericName; // Mainly for medical products

    private Long categoryId;

    private Long subCategoryId;

    private Long unitId;

    // Medical-specific fields (optional for non-medical products)
    private DosageForm dosageForm;

    @Size(max = 100, message = "Strength must not exceed 100 characters")
    private String strength;

    private DrugSchedule drugSchedule;

    @Size(max = 200, message = "Manufacturer must not exceed 200 characters")
    private String manufacturer;

    @Size(max = 200, message = "Supplier must not exceed 200 characters")
    private String supplier;

    @Size(max = 200, message = "Barcode must not exceed 200 characters")
    private String barcode;

    private String description;

    // Pricing
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;
    private BigDecimal profitMargin;
    private BigDecimal gstRate;
    private Long taxCategoryId;

    // Inventory thresholds
    private Integer reorderLevel;
    private Integer minimumStock;
    private Integer maximumStock;

    // Medical flags (optional for non-medical products)
    private Boolean isPrescriptionRequired;
    private Boolean isNarcotic;
    private Boolean isRefrigerated;

    // Common additional fields
    private String countryOfOrigin;
    private String packageDimensions;
    private Integer weightGrams;
    private String additionalAttributes; // JSON string

    // === SUPPLEMENT FIELDS ===
    private String supplementType; // Vitamin, Mineral, Protein, Herbal
    private String activeIngredients;
    private String dosageInstructions;
    private String servingSize;
    private Integer servingsPerContainer;
    private String ageGroup;
    private String warnings;
    private Boolean isFdaApproved;
    private Boolean isCertifiedOrganic;

    // === FOOD FIELDS ===
    private String ingredients;
    private String nutritionalInfo; // JSON string
    private String allergenInfo;
    private Integer shelfLifeDays;
    private Boolean isOrganic;
    private Boolean isVegan;
    private Boolean isVegetarian;
    private Boolean isGlutenFree;
    private String fssaiLicense;
    private String foodCategory;

    // === BABY CARE FIELDS ===
    private String ageRange; // "0-6 months", etc.
    private String productSubType; // Diaper, Food, Oil, etc.
    private String size; // S, M, L, XL
    private Boolean isHypoallergenic;
    private Boolean isDermatologicallyTested;
    private Boolean isFragranceFree;
    private Integer packQuantity;
    private String usageInstructions;

    // === COSMETIC FIELDS ===
    private String skinType; // All, Oily, Dry, Combination, Sensitive
    private Boolean dermatologicallyTested;
    private Boolean isParabenFree;
    private Boolean isCrueltyFree;
    private Integer spfRating;
    private String fragranceType;
    private Integer expiryMonthsAfterOpening;
    private String cosmeticCategory;

    // === MEDICAL EQUIPMENT FIELDS ===
    private String equipmentType; // Diagnostic, Therapeutic, Monitoring
    private Integer warrantyMonths;
    private Boolean requiresCalibration;
    private Integer calibrationFrequencyDays;
    private String powerSource; // Battery, Electric, Manual
    private String specifications;
    private String brandModel;
    private Boolean isCertified;
    private String certificationNumber;

    // === SURGICAL FIELDS ===
    private Boolean sterilized;
    private Boolean singleUse;
    private String material;
    private Boolean isLatexFree;
    private String sterilizationMethod;
    private String surgicalCategory;

    // === AYURVEDIC FIELDS ===
    private String ayurvedicType; // Classical, Patent, Proprietary
    private String ayushLicense;
    private String contraindications;
    private String therapeuticUses;
    private String preparationMethod;
    private Boolean isClassicalFormulation;

    // === HOMEOPATHIC FIELDS ===
    private String potency; // 6CH, 30CH, 200CH, 1M, etc.
    private String motherTincture;
    private String indications;
    private String form; // Dilution, Tablet, Globules, etc.
    private String homeopathicPharmacopoeia;
    private Boolean isCombinationRemedy;

    // === GENERAL FIELDS ===
    private String productCategory;
}