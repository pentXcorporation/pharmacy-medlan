package com.pharmacy.medlan.dto.request.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import com.pharmacy.medlan.enums.ProductType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Update Product Request DTO
 * Note: productType cannot be changed after creation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    // Product type is read-only after creation (for validation only)
    private ProductType productType;

    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String productName;

    @Size(max = 200, message = "Generic name must not exceed 200 characters")
    private String genericName;

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

    // Medical flags
    private Boolean isPrescriptionRequired;
    private Boolean isActive;
    private Boolean isDiscontinued;
    private Boolean isNarcotic;
    private Boolean isRefrigerated;
    
    // Common additional fields
    private String countryOfOrigin;
    private String packageDimensions;
    private Integer weightGrams;
    private String additionalAttributes;
    
    // Type-specific fields for all product types
    private String supplementType;
    private String activeIngredients;
    private String dosageInstructions;
    private String servingSize;
    private Integer servingsPerContainer;
    private String ageGroup;
    private String warnings;
    private Boolean isFdaApproved;
    private Boolean isCertifiedOrganic;
    private String ingredients;
    private String nutritionalInfo;
    private String allergenInfo;
    private Integer shelfLifeDays;
    private Boolean isOrganic;
    private Boolean isVegan;
    private Boolean isVegetarian;
    private Boolean isGlutenFree;
    private String fssaiLicense;
    private String foodCategory;
    private String ageRange;
    private String productSubType;
    private String size;
    private Boolean isHypoallergenic;
    private Boolean isDermatologicallyTested;
    private Boolean isFragranceFree;
    private Integer packQuantity;
    private String usageInstructions;
    private String skinType;
    private Boolean dermatologicallyTested;
    private Boolean isParabenFree;
    private Boolean isCrueltyFree;
    private Integer spfRating;
    private String fragranceType;
    private Integer expiryMonthsAfterOpening;
    private String cosmeticCategory;
    private String equipmentType;
    private Integer warrantyMonths;
    private Boolean requiresCalibration;
    private Integer calibrationFrequencyDays;
    private String powerSource;
    private String specifications;
    private String brandModel;
    private Boolean isCertified;
    private String certificationNumber;
    private Boolean sterilized;
    private Boolean singleUse;
    private String material;
    private Boolean isLatexFree;
    private String sterilizationMethod;
    private String surgicalCategory;
    private String ayurvedicType;
    private String ayushLicense;
    private String contraindications;
    private String therapeuticUses;
    private String preparationMethod;
    private Boolean isClassicalFormulation;
    private String potency;
    private String motherTincture;
    private String indications;
    private String form;
    private String homeopathicPharmacopoeia;
    private Boolean isCombinationRemedy;
    private String productCategory;
}
