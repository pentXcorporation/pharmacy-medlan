package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.CategoryResponse;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import com.pharmacy.medlan.model.product.*;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    // ==================== Product Mappings ====================

    /**
     * Map CreateProductRequest to Product entity
     * Note: Product instance must be created first using factory pattern in service
     */
    public void toEntity(CreateProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }

        // Map common fields
        product.setProductName(request.getProductName());
        product.setGenericName(request.getGenericName());
        product.setManufacturer(request.getManufacturer());
        product.setSupplier(request.getSupplier());
        product.setBarcode(request.getBarcode());
        product.setDescription(request.getDescription());
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setMrp(request.getMrp());
        product.setProfitMargin(request.getProfitMargin());
        product.setGstRate(request.getGstRate());
        product.setReorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 10);
        product.setMinimumStock(request.getMinimumStock() != null ? request.getMinimumStock() : 5);
        product.setMaximumStock(request.getMaximumStock() != null ? request.getMaximumStock() : 1000);
        product.setIsActive(true);
        product.setIsDiscontinued(false);
        product.setCountryOfOrigin(request.getCountryOfOrigin());
        product.setPackageDimensions(request.getPackageDimensions());
        product.setWeightGrams(request.getWeightGrams());
        product.setAdditionalAttributes(request.getAdditionalAttributes());

        // Map type-specific fields using instanceof
        if (product instanceof MedicalProduct medical) {
            medical.setDosageForm(request.getDosageForm());
            medical.setStrength(request.getStrength());
            medical.setDrugSchedule(request.getDrugSchedule());
            medical.setIsPrescriptionRequired(request.getIsPrescriptionRequired());
            medical.setIsNarcotic(request.getIsNarcotic());
            medical.setIsRefrigerated(request.getIsRefrigerated());
        } else if (product instanceof SupplementProduct supplement) {
            supplement.setSupplementType(request.getSupplementType());
            supplement.setActiveIngredients(request.getActiveIngredients());
            supplement.setDosageInstructions(request.getDosageInstructions());
            supplement.setServingSize(request.getServingSize());
            supplement.setServingsPerContainer(request.getServingsPerContainer());
            supplement.setAgeGroup(request.getAgeGroup());
            supplement.setWarnings(request.getWarnings());
            supplement.setIsFdaApproved(request.getIsFdaApproved());
            supplement.setIsCertifiedOrganic(request.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct food) {
            food.setIngredients(request.getIngredients());
            food.setNutritionalInfo(request.getNutritionalInfo());
            food.setAllergenInfo(request.getAllergenInfo());
            food.setShelfLifeDays(request.getShelfLifeDays());
            food.setIsOrganic(request.getIsOrganic());
            food.setIsVegan(request.getIsVegan());
            food.setIsVegetarian(request.getIsVegetarian());
            food.setIsGlutenFree(request.getIsGlutenFree());
            food.setFssaiLicense(request.getFssaiLicense());
            food.setFoodCategory(request.getFoodCategory());
        } else if (product instanceof BabyCareProduct babyCare) {
            babyCare.setAgeRange(request.getAgeRange());
            babyCare.setProductSubType(request.getProductSubType());
            babyCare.setSize(request.getSize());
            babyCare.setIsHypoallergenic(request.getIsHypoallergenic());
            babyCare.setIsDermatologicallyTested(request.getIsDermatologicallyTested());
            babyCare.setIsFragranceFree(request.getIsFragranceFree());
            babyCare.setPackQuantity(request.getPackQuantity());
            babyCare.setUsageInstructions(request.getUsageInstructions());
        } else if (product instanceof CosmeticProduct cosmetic) {
            cosmetic.setSkinType(request.getSkinType());
            cosmetic.setUsageInstructions(request.getUsageInstructions());
            cosmetic.setIngredients(request.getIngredients());
            cosmetic.setDermatologicallyTested(request.getDermatologicallyTested());
            cosmetic.setIsParabenFree(request.getIsParabenFree());
            cosmetic.setIsCrueltyFree(request.getIsCrueltyFree());
            cosmetic.setSpfRating(request.getSpfRating());
            cosmetic.setFragranceType(request.getFragranceType());
            cosmetic.setExpiryMonthsAfterOpening(request.getExpiryMonthsAfterOpening());
            cosmetic.setCosmeticCategory(request.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct equipment) {
            equipment.setEquipmentType(request.getEquipmentType());
            equipment.setWarrantyMonths(request.getWarrantyMonths());
            equipment.setRequiresCalibration(request.getRequiresCalibration());
            equipment.setCalibrationFrequencyDays(request.getCalibrationFrequencyDays());
            equipment.setPowerSource(request.getPowerSource());
            equipment.setSpecifications(request.getSpecifications());
            equipment.setBrandModel(request.getBrandModel());
            equipment.setUsageInstructions(request.getUsageInstructions());
            equipment.setIsCertified(request.getIsCertified());
            equipment.setCertificationNumber(request.getCertificationNumber());
        } else if (product instanceof SurgicalProduct surgical) {
            surgical.setSterilized(request.getSterilized());
            surgical.setSingleUse(request.getSingleUse());
            surgical.setMaterial(request.getMaterial());
            surgical.setSize(request.getSize());
            surgical.setPackSize(request.getPackQuantity());
            surgical.setSurgicalCategory(request.getSurgicalCategory());
            surgical.setUsageInstructions(request.getUsageInstructions());
            surgical.setIsLatexFree(request.getIsLatexFree());
            surgical.setSterilizationMethod(request.getSterilizationMethod());
        } else if (product instanceof AyurvedicProduct ayurvedic) {
            ayurvedic.setAyurvedicType(request.getAyurvedicType());
            ayurvedic.setIngredients(request.getIngredients());
            ayurvedic.setDosageInstructions(request.getDosageInstructions());
            ayurvedic.setAyushLicense(request.getAyushLicense());
            ayurvedic.setContraindications(request.getContraindications());
            ayurvedic.setTherapeuticUses(request.getTherapeuticUses());
            ayurvedic.setPreparationMethod(request.getPreparationMethod());
            ayurvedic.setIsClassicalFormulation(request.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct homeopathic) {
            homeopathic.setPotency(request.getPotency());
            homeopathic.setMotherTincture(request.getMotherTincture());
            homeopathic.setIndications(request.getIndications());
            homeopathic.setDosageInstructions(request.getDosageInstructions());
            homeopathic.setForm(request.getForm());
            homeopathic.setHomeopathicPharmacopoeia(request.getHomeopathicPharmacopoeia());
            homeopathic.setIsCombinationRemedy(request.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct general) {
            general.setProductCategory(request.getProductCategory());
            general.setUsageInstructions(request.getUsageInstructions());
            general.setMaterial(request.getMaterial());
            general.setSize(request.getSize());
            general.setPackQuantity(request.getPackQuantity());
        }
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .productType(product.getProductType())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .genericName(product.getGenericName())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .subCategoryId(product.getSubCategory() != null ? product.getSubCategory().getId() : null)
                .subCategoryName(product.getSubCategory() != null ? product.getSubCategory().getSubCategoryName() : null)
                .unitId(product.getUnit() != null ? product.getUnit().getId() : null)
                .unitName(product.getUnit() != null ? product.getUnit().getUnitName() : null)
                .manufacturer(product.getManufacturer())
                .supplier(product.getSupplier())
                .barcode(product.getBarcode())
                .description(product.getDescription())
                .costPrice(product.getCostPrice())
                .sellingPrice(product.getSellingPrice())
                .mrp(product.getMrp())
                .profitMargin(product.getProfitMargin())
                .gstRate(product.getGstRate())
                .taxCategoryId(product.getTaxCategory() != null ? product.getTaxCategory().getId() : null)
                .taxCategoryName(product.getTaxCategory() != null ? product.getTaxCategory().getTaxName() : null)
                .reorderLevel(product.getReorderLevel())
                .minimumStock(product.getMinimumStock())
                .maximumStock(product.getMaximumStock())
                .isActive(product.getIsActive())
                .isDiscontinued(product.getIsDiscontinued())
                .countryOfOrigin(product.getCountryOfOrigin())
                .packageDimensions(product.getPackageDimensions())
                .weightGrams(product.getWeightGrams())
                .additionalAttributes(product.getAdditionalAttributes())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt());

        // Add type-specific fields
        if (product instanceof MedicalProduct medical) {
            builder.dosageForm(medical.getDosageForm())
                   .strength(medical.getStrength())
                   .drugSchedule(medical.getDrugSchedule())
                   .isPrescriptionRequired(medical.getIsPrescriptionRequired())
                   .isNarcotic(medical.getIsNarcotic())
                   .isRefrigerated(medical.getIsRefrigerated());
        } else if (product instanceof SupplementProduct supplement) {
            builder.supplementType(supplement.getSupplementType())
                   .activeIngredients(supplement.getActiveIngredients())
                   .dosageInstructions(supplement.getDosageInstructions())
                   .servingSize(supplement.getServingSize())
                   .servingsPerContainer(supplement.getServingsPerContainer())
                   .ageGroup(supplement.getAgeGroup())
                   .warnings(supplement.getWarnings())
                   .isFdaApproved(supplement.getIsFdaApproved())
                   .isCertifiedOrganic(supplement.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct food) {
            builder.ingredients(food.getIngredients())
                   .nutritionalInfo(food.getNutritionalInfo())
                   .allergenInfo(food.getAllergenInfo())
                   .shelfLifeDays(food.getShelfLifeDays())
                   .isOrganic(food.getIsOrganic())
                   .isVegan(food.getIsVegan())
                   .isVegetarian(food.getIsVegetarian())
                   .isGlutenFree(food.getIsGlutenFree())
                   .fssaiLicense(food.getFssaiLicense())
                   .foodCategory(food.getFoodCategory());
        } else if (product instanceof BabyCareProduct babyCare) {
            builder.ageRange(babyCare.getAgeRange())
                   .productSubType(babyCare.getProductSubType())
                   .size(babyCare.getSize())
                   .isHypoallergenic(babyCare.getIsHypoallergenic())
                   .isDermatologicallyTested(babyCare.getIsDermatologicallyTested())
                   .isFragranceFree(babyCare.getIsFragranceFree())
                   .packQuantity(babyCare.getPackQuantity())
                   .usageInstructions(babyCare.getUsageInstructions());
        } else if (product instanceof CosmeticProduct cosmetic) {
            builder.skinType(cosmetic.getSkinType())
                   .usageInstructions(cosmetic.getUsageInstructions())
                   .ingredients(cosmetic.getIngredients())
                   .dermatologicallyTested(cosmetic.getDermatologicallyTested())
                   .isParabenFree(cosmetic.getIsParabenFree())
                   .isCrueltyFree(cosmetic.getIsCrueltyFree())
                   .spfRating(cosmetic.getSpfRating())
                   .fragranceType(cosmetic.getFragranceType())
                   .expiryMonthsAfterOpening(cosmetic.getExpiryMonthsAfterOpening())
                   .cosmeticCategory(cosmetic.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct equipment) {
            builder.equipmentType(equipment.getEquipmentType())
                   .warrantyMonths(equipment.getWarrantyMonths())
                   .requiresCalibration(equipment.getRequiresCalibration())
                   .calibrationFrequencyDays(equipment.getCalibrationFrequencyDays())
                   .powerSource(equipment.getPowerSource())
                   .specifications(equipment.getSpecifications())
                   .brandModel(equipment.getBrandModel())
                   .usageInstructions(equipment.getUsageInstructions())
                   .isCertified(equipment.getIsCertified())
                   .certificationNumber(equipment.getCertificationNumber());
        } else if (product instanceof SurgicalProduct surgical) {
            builder.sterilized(surgical.getSterilized())
                   .singleUse(surgical.getSingleUse())
                   .material(surgical.getMaterial())
                   .size(surgical.getSize())
                   .packQuantity(surgical.getPackSize())
                   .isLatexFree(surgical.getIsLatexFree())
                   .sterilizationMethod(surgical.getSterilizationMethod())
                   .surgicalCategory(surgical.getSurgicalCategory())
                   .usageInstructions(surgical.getUsageInstructions());
        } else if (product instanceof AyurvedicProduct ayurvedic) {
            builder.ayurvedicType(ayurvedic.getAyurvedicType())
                   .ingredients(ayurvedic.getIngredients())
                   .dosageInstructions(ayurvedic.getDosageInstructions())
                   .ayushLicense(ayurvedic.getAyushLicense())
                   .contraindications(ayurvedic.getContraindications())
                   .therapeuticUses(ayurvedic.getTherapeuticUses())
                   .preparationMethod(ayurvedic.getPreparationMethod())
                   .isClassicalFormulation(ayurvedic.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct homeopathic) {
            builder.potency(homeopathic.getPotency())
                   .motherTincture(homeopathic.getMotherTincture())
                   .indications(homeopathic.getIndications())
                   .dosageInstructions(homeopathic.getDosageInstructions())
                   .form(homeopathic.getForm())
                   .homeopathicPharmacopoeia(homeopathic.getHomeopathicPharmacopoeia())

                   .isCombinationRemedy(homeopathic.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct general) {
            builder.productCategory(general.getProductCategory())
                   .usageInstructions(general.getUsageInstructions())
                   .material(general.getMaterial())
                   .size(general.getSize())
                   .packQuantity(general.getPackQuantity());
        }

        return builder.build();
    }

    public void updateEntityFromRequest(UpdateProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }

        // Update common fields
        if (request.getProductName() != null) product.setProductName(request.getProductName());
        if (request.getGenericName() != null) product.setGenericName(request.getGenericName());
        if (request.getManufacturer() != null) product.setManufacturer(request.getManufacturer());
        if (request.getSupplier() != null) product.setSupplier(request.getSupplier());
        if (request.getBarcode() != null) product.setBarcode(request.getBarcode());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getCostPrice() != null) product.setCostPrice(request.getCostPrice());
        if (request.getSellingPrice() != null) product.setSellingPrice(request.getSellingPrice());
        if (request.getMrp() != null) product.setMrp(request.getMrp());
        if (request.getProfitMargin() != null) product.setProfitMargin(request.getProfitMargin());
        if (request.getGstRate() != null) product.setGstRate(request.getGstRate());
        if (request.getReorderLevel() != null) product.setReorderLevel(request.getReorderLevel());
        if (request.getMinimumStock() != null) product.setMinimumStock(request.getMinimumStock());
        if (request.getMaximumStock() != null) product.setMaximumStock(request.getMaximumStock());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getIsDiscontinued() != null) product.setIsDiscontinued(request.getIsDiscontinued());
        if (request.getCountryOfOrigin() != null) product.setCountryOfOrigin(request.getCountryOfOrigin());
        if (request.getPackageDimensions() != null) product.setPackageDimensions(request.getPackageDimensions());
        if (request.getWeightGrams() != null) product.setWeightGrams(request.getWeightGrams());
        if (request.getAdditionalAttributes() != null) product.setAdditionalAttributes(request.getAdditionalAttributes());

        // Update type-specific fields
        if (product instanceof MedicalProduct medical) {
            if (request.getDosageForm() != null) medical.setDosageForm(request.getDosageForm());
            if (request.getStrength() != null) medical.setStrength(request.getStrength());
            if (request.getDrugSchedule() != null) medical.setDrugSchedule(request.getDrugSchedule());
            if (request.getIsPrescriptionRequired() != null) medical.setIsPrescriptionRequired(request.getIsPrescriptionRequired());
            if (request.getIsNarcotic() != null) medical.setIsNarcotic(request.getIsNarcotic());
            if (request.getIsRefrigerated() != null) medical.setIsRefrigerated(request.getIsRefrigerated());
        } else if (product instanceof SupplementProduct supplement) {
            if (request.getSupplementType() != null) supplement.setSupplementType(request.getSupplementType());
            if (request.getActiveIngredients() != null) supplement.setActiveIngredients(request.getActiveIngredients());
            if (request.getDosageInstructions() != null) supplement.setDosageInstructions(request.getDosageInstructions());
            if (request.getServingSize() != null) supplement.setServingSize(request.getServingSize());
            if (request.getServingsPerContainer() != null) supplement.setServingsPerContainer(request.getServingsPerContainer());
            if (request.getAgeGroup() != null) supplement.setAgeGroup(request.getAgeGroup());
            if (request.getWarnings() != null) supplement.setWarnings(request.getWarnings());
            if (request.getIsFdaApproved() != null) supplement.setIsFdaApproved(request.getIsFdaApproved());
            if (request.getIsCertifiedOrganic() != null) supplement.setIsCertifiedOrganic(request.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct food) {
            if (request.getIngredients() != null) food.setIngredients(request.getIngredients());
            if (request.getNutritionalInfo() != null) food.setNutritionalInfo(request.getNutritionalInfo());
            if (request.getAllergenInfo() != null) food.setAllergenInfo(request.getAllergenInfo());
            if (request.getShelfLifeDays() != null) food.setShelfLifeDays(request.getShelfLifeDays());
            if (request.getIsOrganic() != null) food.setIsOrganic(request.getIsOrganic());
            if (request.getIsVegan() != null) food.setIsVegan(request.getIsVegan());
            if (request.getIsVegetarian() != null) food.setIsVegetarian(request.getIsVegetarian());
            if (request.getIsGlutenFree() != null) food.setIsGlutenFree(request.getIsGlutenFree());
            if (request.getFssaiLicense() != null) food.setFssaiLicense(request.getFssaiLicense());
            if (request.getFoodCategory() != null) food.setFoodCategory(request.getFoodCategory());
        } else if (product instanceof BabyCareProduct babyCare) {
            if (request.getAgeRange() != null) babyCare.setAgeRange(request.getAgeRange());
            if (request.getProductSubType() != null) babyCare.setProductSubType(request.getProductSubType());
            if (request.getSize() != null) babyCare.setSize(request.getSize());
            if (request.getIsHypoallergenic() != null) babyCare.setIsHypoallergenic(request.getIsHypoallergenic());
            if (request.getIsDermatologicallyTested() != null) babyCare.setIsDermatologicallyTested(request.getIsDermatologicallyTested());
            if (request.getIsFragranceFree() != null) babyCare.setIsFragranceFree(request.getIsFragranceFree());
            if (request.getPackQuantity() != null) babyCare.setPackQuantity(request.getPackQuantity());
            if (request.getUsageInstructions() != null) babyCare.setUsageInstructions(request.getUsageInstructions());
        } else if (product instanceof CosmeticProduct cosmetic) {
            if (request.getSkinType() != null) cosmetic.setSkinType(request.getSkinType());
            if (request.getUsageInstructions() != null) cosmetic.setUsageInstructions(request.getUsageInstructions());
            if (request.getIngredients() != null) cosmetic.setIngredients(request.getIngredients());
            if (request.getDermatologicallyTested() != null) cosmetic.setDermatologicallyTested(request.getDermatologicallyTested());
            if (request.getIsParabenFree() != null) cosmetic.setIsParabenFree(request.getIsParabenFree());
            if (request.getIsCrueltyFree() != null) cosmetic.setIsCrueltyFree(request.getIsCrueltyFree());
            if (request.getSpfRating() != null) cosmetic.setSpfRating(request.getSpfRating());
            if (request.getFragranceType() != null) cosmetic.setFragranceType(request.getFragranceType());
            if (request.getExpiryMonthsAfterOpening() != null) cosmetic.setExpiryMonthsAfterOpening(request.getExpiryMonthsAfterOpening());
            if (request.getCosmeticCategory() != null) cosmetic.setCosmeticCategory(request.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct equipment) {
            if (request.getEquipmentType() != null) equipment.setEquipmentType(request.getEquipmentType());
            if (request.getWarrantyMonths() != null) equipment.setWarrantyMonths(request.getWarrantyMonths());
            if (request.getRequiresCalibration() != null) equipment.setRequiresCalibration(request.getRequiresCalibration());
            if (request.getCalibrationFrequencyDays() != null) equipment.setCalibrationFrequencyDays(request.getCalibrationFrequencyDays());
            if (request.getPowerSource() != null) equipment.setPowerSource(request.getPowerSource());
            if (request.getSpecifications() != null) equipment.setSpecifications(request.getSpecifications());
            if (request.getBrandModel() != null) equipment.setBrandModel(request.getBrandModel());
            if (request.getUsageInstructions() != null) equipment.setUsageInstructions(request.getUsageInstructions());
            if (request.getIsCertified() != null) equipment.setIsCertified(request.getIsCertified());
            if (request.getCertificationNumber() != null) equipment.setCertificationNumber(request.getCertificationNumber());
        } else if (product instanceof SurgicalProduct surgical) {
            if (request.getSterilized() != null) surgical.setSterilized(request.getSterilized());
            if (request.getSingleUse() != null) surgical.setSingleUse(request.getSingleUse());
            if (request.getMaterial() != null) surgical.setMaterial(request.getMaterial());
            if (request.getSize() != null) surgical.setSize(request.getSize());
            if (request.getPackQuantity() != null) surgical.setPackSize(request.getPackQuantity());
            if (request.getIsLatexFree() != null) surgical.setIsLatexFree(request.getIsLatexFree());
            if (request.getSterilizationMethod() != null) surgical.setSterilizationMethod(request.getSterilizationMethod());
            if (request.getSurgicalCategory() != null) surgical.setSurgicalCategory(request.getSurgicalCategory());
            if (request.getUsageInstructions() != null) surgical.setUsageInstructions(request.getUsageInstructions());
        } else if (product instanceof AyurvedicProduct ayurvedic) {
            if (request.getAyurvedicType() != null) ayurvedic.setAyurvedicType(request.getAyurvedicType());
            if (request.getIngredients() != null) ayurvedic.setIngredients(request.getIngredients());
            if (request.getDosageInstructions() != null) ayurvedic.setDosageInstructions(request.getDosageInstructions());
            if (request.getAyushLicense() != null) ayurvedic.setAyushLicense(request.getAyushLicense());
            if (request.getContraindications() != null) ayurvedic.setContraindications(request.getContraindications());
            if (request.getTherapeuticUses() != null) ayurvedic.setTherapeuticUses(request.getTherapeuticUses());
            if (request.getPreparationMethod() != null) ayurvedic.setPreparationMethod(request.getPreparationMethod());
            if (request.getIsClassicalFormulation() != null) ayurvedic.setIsClassicalFormulation(request.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct homeopathic) {
            if (request.getPotency() != null) homeopathic.setPotency(request.getPotency());
            if (request.getMotherTincture() != null) homeopathic.setMotherTincture(request.getMotherTincture());
            if (request.getIndications() != null) homeopathic.setIndications(request.getIndications());
            if (request.getDosageInstructions() != null) homeopathic.setDosageInstructions(request.getDosageInstructions());
            if (request.getForm() != null) homeopathic.setForm(request.getForm());
            if (request.getHomeopathicPharmacopoeia() != null) homeopathic.setHomeopathicPharmacopoeia(request.getHomeopathicPharmacopoeia());
            if (request.getIsCombinationRemedy() != null) homeopathic.setIsCombinationRemedy(request.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct general) {
            if (request.getProductCategory() != null) general.setProductCategory(request.getProductCategory());
            if (request.getUsageInstructions() != null) general.setUsageInstructions(request.getUsageInstructions());
            if (request.getMaterial() != null) general.setMaterial(request.getMaterial());
            if (request.getSize() != null) general.setSize(request.getSize());
            if (request.getPackQuantity() != null) general.setPackQuantity(request.getPackQuantity());
        }
    }

    // ==================== Category Mappings ====================

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .categoryCode(category.getCategoryCode())
                .description(category.getDescription())
                .minCode(category.getMinCode())
                .maxCode(category.getMaxCode())
                .isActive(category.getIsActive())
                .subCategoryCount(0) // Set to 0 to avoid LazyInitializationException
                .productCount(0) // Set to 0 to avoid LazyInitializationException
                .subCategories(null) // Set to null to avoid LazyInitializationException
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    // ==================== SubCategory Mappings ====================

    public SubCategoryResponse toSubCategoryResponse(SubCategory subCategory) {
        if (subCategory == null) {
            return null;
        }

        return SubCategoryResponse.builder()
                .id(subCategory.getId())
                .subCategoryName(subCategory.getSubCategoryName())
                .subCategoryCode(subCategory.getSubCategoryCode())
                .description(subCategory.getDescription())
                .minCode(subCategory.getMinCode())
                .maxCode(subCategory.getMaxCode())
                .isActive(subCategory.getIsActive())
                .categoryId(subCategory.getCategory() != null ? subCategory.getCategory().getId() : null)
                .categoryName(subCategory.getCategory() != null ? subCategory.getCategory().getCategoryName() : null)
                .productCount(subCategory.getProducts() != null ? subCategory.getProducts().size() : 0)
                .createdAt(subCategory.getCreatedAt())
                .updatedAt(subCategory.getUpdatedAt())
                .build();
    }
}
