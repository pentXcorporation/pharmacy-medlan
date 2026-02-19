package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.CategoryResponse;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import com.pharmacy.medlan.model.product.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    // ==================== Product Mappings ====================

    /**
     * Populate a Product entity from a CreateProductRequest.
     * The concrete Product subtype must be instantiated by the service before calling this.
     */
    public void toEntity(CreateProductRequest request, Product product) {
        if (request == null || product == null) return;

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

        applyTypeSpecificCreate(request, product);
    }

    private void applyTypeSpecificCreate(CreateProductRequest r, Product product) {
        if (product instanceof MedicalProduct p) {
            p.setDosageForm(r.getDosageForm());
            p.setStrength(r.getStrength());
            p.setDrugSchedule(r.getDrugSchedule());
            p.setIsPrescriptionRequired(r.getIsPrescriptionRequired());
            p.setIsNarcotic(r.getIsNarcotic());
            p.setIsRefrigerated(r.getIsRefrigerated());
        } else if (product instanceof SupplementProduct p) {
            p.setSupplementType(r.getSupplementType());
            p.setActiveIngredients(r.getActiveIngredients());
            p.setDosageInstructions(r.getDosageInstructions());
            p.setServingSize(r.getServingSize());
            p.setServingsPerContainer(r.getServingsPerContainer());
            p.setAgeGroup(r.getAgeGroup());
            p.setWarnings(r.getWarnings());
            p.setIsFdaApproved(r.getIsFdaApproved());
            p.setIsCertifiedOrganic(r.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct p) {
            p.setIngredients(r.getIngredients());
            p.setNutritionalInfo(r.getNutritionalInfo());
            p.setAllergenInfo(r.getAllergenInfo());
            p.setShelfLifeDays(r.getShelfLifeDays());
            p.setIsOrganic(r.getIsOrganic());
            p.setIsVegan(r.getIsVegan());
            p.setIsVegetarian(r.getIsVegetarian());
            p.setIsGlutenFree(r.getIsGlutenFree());
            p.setFssaiLicense(r.getFssaiLicense());
            p.setFoodCategory(r.getFoodCategory());
        } else if (product instanceof BabyCareProduct p) {
            p.setAgeRange(r.getAgeRange());
            p.setProductSubType(r.getProductSubType());
            p.setSize(r.getSize());
            p.setIsHypoallergenic(r.getIsHypoallergenic());
            p.setIsDermatologicallyTested(r.getIsDermatologicallyTested());
            p.setIsFragranceFree(r.getIsFragranceFree());
            p.setPackQuantity(r.getPackQuantity());
            p.setUsageInstructions(r.getUsageInstructions());
        } else if (product instanceof CosmeticProduct p) {
            p.setSkinType(r.getSkinType());
            p.setUsageInstructions(r.getUsageInstructions());
            p.setIngredients(r.getIngredients());
            p.setDermatologicallyTested(r.getDermatologicallyTested());
            p.setIsParabenFree(r.getIsParabenFree());
            p.setIsCrueltyFree(r.getIsCrueltyFree());
            p.setSpfRating(r.getSpfRating());
            p.setFragranceType(r.getFragranceType());
            p.setExpiryMonthsAfterOpening(r.getExpiryMonthsAfterOpening());
            p.setCosmeticCategory(r.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct p) {
            p.setEquipmentType(r.getEquipmentType());
            p.setWarrantyMonths(r.getWarrantyMonths());
            p.setRequiresCalibration(r.getRequiresCalibration());
            p.setCalibrationFrequencyDays(r.getCalibrationFrequencyDays());
            p.setPowerSource(r.getPowerSource());
            p.setSpecifications(r.getSpecifications());
            p.setBrandModel(r.getBrandModel());
            p.setUsageInstructions(r.getUsageInstructions());
            p.setIsCertified(r.getIsCertified());
            p.setCertificationNumber(r.getCertificationNumber());
        } else if (product instanceof SurgicalProduct p) {
            p.setSterilized(r.getSterilized());
            p.setSingleUse(r.getSingleUse());
            p.setMaterial(r.getMaterial());
            p.setSize(r.getSize());
            p.setPackSize(r.getPackQuantity());
            p.setIsLatexFree(r.getIsLatexFree());
            p.setSterilizationMethod(r.getSterilizationMethod());
            p.setSurgicalCategory(r.getSurgicalCategory());
            p.setUsageInstructions(r.getUsageInstructions());
        } else if (product instanceof AyurvedicProduct p) {
            p.setAyurvedicType(r.getAyurvedicType());
            p.setIngredients(r.getIngredients());
            p.setDosageInstructions(r.getDosageInstructions());
            p.setAyushLicense(r.getAyushLicense());
            p.setContraindications(r.getContraindications());
            p.setTherapeuticUses(r.getTherapeuticUses());
            p.setPreparationMethod(r.getPreparationMethod());
            p.setIsClassicalFormulation(r.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct p) {
            p.setPotency(r.getPotency());
            p.setMotherTincture(r.getMotherTincture());
            p.setIndications(r.getIndications());
            p.setDosageInstructions(r.getDosageInstructions());
            p.setForm(r.getForm());
            p.setHomeopathicPharmacopoeia(r.getHomeopathicPharmacopoeia());
            p.setIsCombinationRemedy(r.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct p) {
            p.setProductCategory(r.getProductCategory());
            p.setUsageInstructions(r.getUsageInstructions());
            p.setMaterial(r.getMaterial());
            p.setSize(r.getSize());
            p.setPackQuantity(r.getPackQuantity());
        }
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) return null;

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

        applyTypeSpecificResponse(product, builder);
        return builder.build();
    }

    private void applyTypeSpecificResponse(Product product, ProductResponse.ProductResponseBuilder builder) {
        if (product instanceof MedicalProduct p) {
            builder.dosageForm(p.getDosageForm())
                    .strength(p.getStrength())
                    .drugSchedule(p.getDrugSchedule())
                    .isPrescriptionRequired(p.getIsPrescriptionRequired())
                    .isNarcotic(p.getIsNarcotic())
                    .isRefrigerated(p.getIsRefrigerated());
        } else if (product instanceof SupplementProduct p) {
            builder.supplementType(p.getSupplementType())
                    .activeIngredients(p.getActiveIngredients())
                    .dosageInstructions(p.getDosageInstructions())
                    .servingSize(p.getServingSize())
                    .servingsPerContainer(p.getServingsPerContainer())
                    .ageGroup(p.getAgeGroup())
                    .warnings(p.getWarnings())
                    .isFdaApproved(p.getIsFdaApproved())
                    .isCertifiedOrganic(p.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct p) {
            builder.ingredients(p.getIngredients())
                    .nutritionalInfo(p.getNutritionalInfo())
                    .allergenInfo(p.getAllergenInfo())
                    .shelfLifeDays(p.getShelfLifeDays())
                    .isOrganic(p.getIsOrganic())
                    .isVegan(p.getIsVegan())
                    .isVegetarian(p.getIsVegetarian())
                    .isGlutenFree(p.getIsGlutenFree())
                    .fssaiLicense(p.getFssaiLicense())
                    .foodCategory(p.getFoodCategory());
        } else if (product instanceof BabyCareProduct p) {
            builder.ageRange(p.getAgeRange())
                    .productSubType(p.getProductSubType())
                    .size(p.getSize())
                    .isHypoallergenic(p.getIsHypoallergenic())
                    .isDermatologicallyTested(p.getIsDermatologicallyTested())
                    .isFragranceFree(p.getIsFragranceFree())
                    .packQuantity(p.getPackQuantity())
                    .usageInstructions(p.getUsageInstructions());
        } else if (product instanceof CosmeticProduct p) {
            builder.skinType(p.getSkinType())
                    .usageInstructions(p.getUsageInstructions())
                    .ingredients(p.getIngredients())
                    .dermatologicallyTested(p.getDermatologicallyTested())
                    .isParabenFree(p.getIsParabenFree())
                    .isCrueltyFree(p.getIsCrueltyFree())
                    .spfRating(p.getSpfRating())
                    .fragranceType(p.getFragranceType())
                    .expiryMonthsAfterOpening(p.getExpiryMonthsAfterOpening())
                    .cosmeticCategory(p.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct p) {
            builder.equipmentType(p.getEquipmentType())
                    .warrantyMonths(p.getWarrantyMonths())
                    .requiresCalibration(p.getRequiresCalibration())
                    .calibrationFrequencyDays(p.getCalibrationFrequencyDays())
                    .powerSource(p.getPowerSource())
                    .specifications(p.getSpecifications())
                    .brandModel(p.getBrandModel())
                    .usageInstructions(p.getUsageInstructions())
                    .isCertified(p.getIsCertified())
                    .certificationNumber(p.getCertificationNumber());
        } else if (product instanceof SurgicalProduct p) {
            builder.sterilized(p.getSterilized())
                    .singleUse(p.getSingleUse())
                    .material(p.getMaterial())
                    .size(p.getSize())
                    .packQuantity(p.getPackSize())
                    .isLatexFree(p.getIsLatexFree())
                    .sterilizationMethod(p.getSterilizationMethod())
                    .surgicalCategory(p.getSurgicalCategory())
                    .usageInstructions(p.getUsageInstructions());
        } else if (product instanceof AyurvedicProduct p) {
            builder.ayurvedicType(p.getAyurvedicType())
                    .ingredients(p.getIngredients())
                    .dosageInstructions(p.getDosageInstructions())
                    .ayushLicense(p.getAyushLicense())
                    .contraindications(p.getContraindications())
                    .therapeuticUses(p.getTherapeuticUses())
                    .preparationMethod(p.getPreparationMethod())
                    .isClassicalFormulation(p.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct p) {
            builder.potency(p.getPotency())
                    .motherTincture(p.getMotherTincture())
                    .indications(p.getIndications())
                    .dosageInstructions(p.getDosageInstructions())
                    .form(p.getForm())
                    .homeopathicPharmacopoeia(p.getHomeopathicPharmacopoeia())
                    .isCombinationRemedy(p.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct p) {
            builder.productCategory(p.getProductCategory())
                    .usageInstructions(p.getUsageInstructions())
                    .material(p.getMaterial())
                    .size(p.getSize())
                    .packQuantity(p.getPackQuantity());
        }
    }

    /** Applies only non-null fields from UpdateProductRequest (partial update semantics). */
    public void updateEntity(UpdateProductRequest request, Product product) {
        if (request == null || product == null) return;

        if (request.getProductName() != null)       product.setProductName(request.getProductName());
        if (request.getGenericName() != null)       product.setGenericName(request.getGenericName());
        if (request.getManufacturer() != null)      product.setManufacturer(request.getManufacturer());
        if (request.getSupplier() != null)          product.setSupplier(request.getSupplier());
        if (request.getBarcode() != null)           product.setBarcode(request.getBarcode());
        if (request.getDescription() != null)       product.setDescription(request.getDescription());
        if (request.getCostPrice() != null)         product.setCostPrice(request.getCostPrice());
        if (request.getSellingPrice() != null)      product.setSellingPrice(request.getSellingPrice());
        if (request.getMrp() != null)               product.setMrp(request.getMrp());
        if (request.getProfitMargin() != null)      product.setProfitMargin(request.getProfitMargin());
        if (request.getGstRate() != null)           product.setGstRate(request.getGstRate());
        if (request.getReorderLevel() != null)      product.setReorderLevel(request.getReorderLevel());
        if (request.getMinimumStock() != null)      product.setMinimumStock(request.getMinimumStock());
        if (request.getMaximumStock() != null)      product.setMaximumStock(request.getMaximumStock());
        if (request.getIsActive() != null)          product.setIsActive(request.getIsActive());
        if (request.getIsDiscontinued() != null)    product.setIsDiscontinued(request.getIsDiscontinued());
        if (request.getCountryOfOrigin() != null)   product.setCountryOfOrigin(request.getCountryOfOrigin());
        if (request.getPackageDimensions() != null) product.setPackageDimensions(request.getPackageDimensions());
        if (request.getWeightGrams() != null)       product.setWeightGrams(request.getWeightGrams());
        if (request.getAdditionalAttributes() != null) product.setAdditionalAttributes(request.getAdditionalAttributes());

        applyTypeSpecificUpdate(request, product);
    }

    private void applyTypeSpecificUpdate(UpdateProductRequest r, Product product) {
        if (product instanceof MedicalProduct p) {
            if (r.getDosageForm() != null)             p.setDosageForm(r.getDosageForm());
            if (r.getStrength() != null)               p.setStrength(r.getStrength());
            if (r.getDrugSchedule() != null)           p.setDrugSchedule(r.getDrugSchedule());
            if (r.getIsPrescriptionRequired() != null) p.setIsPrescriptionRequired(r.getIsPrescriptionRequired());
            if (r.getIsNarcotic() != null)             p.setIsNarcotic(r.getIsNarcotic());
            if (r.getIsRefrigerated() != null)         p.setIsRefrigerated(r.getIsRefrigerated());
        } else if (product instanceof SupplementProduct p) {
            if (r.getSupplementType() != null)       p.setSupplementType(r.getSupplementType());
            if (r.getActiveIngredients() != null)    p.setActiveIngredients(r.getActiveIngredients());
            if (r.getDosageInstructions() != null)   p.setDosageInstructions(r.getDosageInstructions());
            if (r.getServingSize() != null)          p.setServingSize(r.getServingSize());
            if (r.getServingsPerContainer() != null) p.setServingsPerContainer(r.getServingsPerContainer());
            if (r.getAgeGroup() != null)             p.setAgeGroup(r.getAgeGroup());
            if (r.getWarnings() != null)             p.setWarnings(r.getWarnings());
            if (r.getIsFdaApproved() != null)        p.setIsFdaApproved(r.getIsFdaApproved());
            if (r.getIsCertifiedOrganic() != null)   p.setIsCertifiedOrganic(r.getIsCertifiedOrganic());
        } else if (product instanceof FoodProduct p) {
            if (r.getIngredients() != null)      p.setIngredients(r.getIngredients());
            if (r.getNutritionalInfo() != null)  p.setNutritionalInfo(r.getNutritionalInfo());
            if (r.getAllergenInfo() != null)      p.setAllergenInfo(r.getAllergenInfo());
            if (r.getShelfLifeDays() != null)    p.setShelfLifeDays(r.getShelfLifeDays());
            if (r.getIsOrganic() != null)        p.setIsOrganic(r.getIsOrganic());
            if (r.getIsVegan() != null)          p.setIsVegan(r.getIsVegan());
            if (r.getIsVegetarian() != null)     p.setIsVegetarian(r.getIsVegetarian());
            if (r.getIsGlutenFree() != null)     p.setIsGlutenFree(r.getIsGlutenFree());
            if (r.getFssaiLicense() != null)     p.setFssaiLicense(r.getFssaiLicense());
            if (r.getFoodCategory() != null)     p.setFoodCategory(r.getFoodCategory());
        } else if (product instanceof BabyCareProduct p) {
            if (r.getAgeRange() != null)                  p.setAgeRange(r.getAgeRange());
            if (r.getProductSubType() != null)            p.setProductSubType(r.getProductSubType());
            if (r.getSize() != null)                      p.setSize(r.getSize());
            if (r.getIsHypoallergenic() != null)          p.setIsHypoallergenic(r.getIsHypoallergenic());
            if (r.getIsDermatologicallyTested() != null)  p.setIsDermatologicallyTested(r.getIsDermatologicallyTested());
            if (r.getIsFragranceFree() != null)           p.setIsFragranceFree(r.getIsFragranceFree());
            if (r.getPackQuantity() != null)              p.setPackQuantity(r.getPackQuantity());
            if (r.getUsageInstructions() != null)         p.setUsageInstructions(r.getUsageInstructions());
        } else if (product instanceof CosmeticProduct p) {
            if (r.getSkinType() != null)                  p.setSkinType(r.getSkinType());
            if (r.getUsageInstructions() != null)         p.setUsageInstructions(r.getUsageInstructions());
            if (r.getIngredients() != null)               p.setIngredients(r.getIngredients());
            if (r.getDermatologicallyTested() != null)    p.setDermatologicallyTested(r.getDermatologicallyTested());
            if (r.getIsParabenFree() != null)             p.setIsParabenFree(r.getIsParabenFree());
            if (r.getIsCrueltyFree() != null)             p.setIsCrueltyFree(r.getIsCrueltyFree());
            if (r.getSpfRating() != null)                 p.setSpfRating(r.getSpfRating());
            if (r.getFragranceType() != null)             p.setFragranceType(r.getFragranceType());
            if (r.getExpiryMonthsAfterOpening() != null)  p.setExpiryMonthsAfterOpening(r.getExpiryMonthsAfterOpening());
            if (r.getCosmeticCategory() != null)          p.setCosmeticCategory(r.getCosmeticCategory());
        } else if (product instanceof MedicalEquipmentProduct p) {
            if (r.getEquipmentType() != null)           p.setEquipmentType(r.getEquipmentType());
            if (r.getWarrantyMonths() != null)          p.setWarrantyMonths(r.getWarrantyMonths());
            if (r.getRequiresCalibration() != null)     p.setRequiresCalibration(r.getRequiresCalibration());
            if (r.getCalibrationFrequencyDays() != null) p.setCalibrationFrequencyDays(r.getCalibrationFrequencyDays());
            if (r.getPowerSource() != null)             p.setPowerSource(r.getPowerSource());
            if (r.getSpecifications() != null)          p.setSpecifications(r.getSpecifications());
            if (r.getBrandModel() != null)              p.setBrandModel(r.getBrandModel());
            if (r.getUsageInstructions() != null)       p.setUsageInstructions(r.getUsageInstructions());
            if (r.getIsCertified() != null)             p.setIsCertified(r.getIsCertified());
            if (r.getCertificationNumber() != null)     p.setCertificationNumber(r.getCertificationNumber());
        } else if (product instanceof SurgicalProduct p) {
            if (r.getSterilized() != null)          p.setSterilized(r.getSterilized());
            if (r.getSingleUse() != null)           p.setSingleUse(r.getSingleUse());
            if (r.getMaterial() != null)            p.setMaterial(r.getMaterial());
            if (r.getSize() != null)                p.setSize(r.getSize());
            if (r.getPackQuantity() != null)        p.setPackSize(r.getPackQuantity());
            if (r.getIsLatexFree() != null)         p.setIsLatexFree(r.getIsLatexFree());
            if (r.getSterilizationMethod() != null) p.setSterilizationMethod(r.getSterilizationMethod());
            if (r.getSurgicalCategory() != null)    p.setSurgicalCategory(r.getSurgicalCategory());
            if (r.getUsageInstructions() != null)   p.setUsageInstructions(r.getUsageInstructions());
        } else if (product instanceof AyurvedicProduct p) {
            if (r.getAyurvedicType() != null)          p.setAyurvedicType(r.getAyurvedicType());
            if (r.getIngredients() != null)            p.setIngredients(r.getIngredients());
            if (r.getDosageInstructions() != null)     p.setDosageInstructions(r.getDosageInstructions());
            if (r.getAyushLicense() != null)           p.setAyushLicense(r.getAyushLicense());
            if (r.getContraindications() != null)      p.setContraindications(r.getContraindications());
            if (r.getTherapeuticUses() != null)        p.setTherapeuticUses(r.getTherapeuticUses());
            if (r.getPreparationMethod() != null)      p.setPreparationMethod(r.getPreparationMethod());
            if (r.getIsClassicalFormulation() != null) p.setIsClassicalFormulation(r.getIsClassicalFormulation());
        } else if (product instanceof HomeopathicProduct p) {
            if (r.getPotency() != null)                    p.setPotency(r.getPotency());
            if (r.getMotherTincture() != null)             p.setMotherTincture(r.getMotherTincture());
            if (r.getIndications() != null)                p.setIndications(r.getIndications());
            if (r.getDosageInstructions() != null)         p.setDosageInstructions(r.getDosageInstructions());
            if (r.getForm() != null)                       p.setForm(r.getForm());
            if (r.getHomeopathicPharmacopoeia() != null)   p.setHomeopathicPharmacopoeia(r.getHomeopathicPharmacopoeia());
            if (r.getIsCombinationRemedy() != null)        p.setIsCombinationRemedy(r.getIsCombinationRemedy());
        } else if (product instanceof GeneralProduct p) {
            if (r.getProductCategory() != null)    p.setProductCategory(r.getProductCategory());
            if (r.getUsageInstructions() != null)  p.setUsageInstructions(r.getUsageInstructions());
            if (r.getMaterial() != null)           p.setMaterial(r.getMaterial());
            if (r.getSize() != null)               p.setSize(r.getSize());
            if (r.getPackQuantity() != null)       p.setPackQuantity(r.getPackQuantity());
        }
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        if (products == null) return Collections.emptyList();
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ==================== Category Mappings ====================

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;

        return CategoryResponse.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .categoryCode(category.getCategoryCode())
                .description(category.getDescription())
                .minCode(category.getMinCode())
                .maxCode(category.getMaxCode())
                .isActive(category.getIsActive())
                .subCategoryCount(0)   // avoid LazyInitializationException; populate in service if needed
                .productCount(0)
                .subCategories(null)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    // ==================== Update Entity From Request ====================

    /**
     * Update an existing Product entity from an UpdateProductRequest.
     * Only non-null fields are updated.
     */
    public void updateEntityFromRequest(UpdateProductRequest request, Product product) {
        if (request == null || product == null) return;

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

        // Type-specific fields
        if (product instanceof MedicalProduct p) {
            if (request.getDosageForm() != null) p.setDosageForm(request.getDosageForm());
            if (request.getStrength() != null) p.setStrength(request.getStrength());
            if (request.getDrugSchedule() != null) p.setDrugSchedule(request.getDrugSchedule());
            if (request.getIsPrescriptionRequired() != null) p.setIsPrescriptionRequired(request.getIsPrescriptionRequired());
            if (request.getIsNarcotic() != null) p.setIsNarcotic(request.getIsNarcotic());
            if (request.getIsRefrigerated() != null) p.setIsRefrigerated(request.getIsRefrigerated());
        }
    }

    // ==================== SubCategory Mappings ====================

    public SubCategoryResponse toSubCategoryResponse(SubCategory subCategory) {
        if (subCategory == null) return null;

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