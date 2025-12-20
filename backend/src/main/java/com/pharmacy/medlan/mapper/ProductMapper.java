package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.CategoryResponse;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import com.pharmacy.medlan.model.product.Category;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.product.SubCategory;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    // ==================== Product Mappings ====================

    public Product toEntity(CreateProductRequest request) {
        if (request == null) {
            return null;
        }

        return Product.builder()
                .productName(request.getProductName())
                .genericName(request.getGenericName())
                .dosageForm(request.getDosageForm())
                .strength(request.getStrength())
                .drugSchedule(request.getDrugSchedule())
                .manufacturer(request.getManufacturer())
                .supplier(request.getSupplier())
                .barcode(request.getBarcode())
                .description(request.getDescription())
                .costPrice(request.getCostPrice())
                .sellingPrice(request.getSellingPrice())
                .mrp(request.getMrp())
                .profitMargin(request.getProfitMargin())
                .gstRate(request.getGstRate())
                .reorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 10)
                .minimumStock(request.getMinimumStock() != null ? request.getMinimumStock() : 5)
                .maximumStock(request.getMaximumStock() != null ? request.getMaximumStock() : 1000)
                .isPrescriptionRequired(request.getIsPrescriptionRequired() != null ? request.getIsPrescriptionRequired() : false)
                .isNarcotic(request.getIsNarcotic() != null ? request.getIsNarcotic() : false)
                .isRefrigerated(request.getIsRefrigerated() != null ? request.getIsRefrigerated() : false)
                .isActive(true)
                .isDiscontinued(false)
                .build();
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        return ProductResponse.builder()
                .id(product.getId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .genericName(product.getGenericName())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .subCategoryId(product.getSubCategory() != null ? product.getSubCategory().getId() : null)
                .subCategoryName(product.getSubCategory() != null ? product.getSubCategory().getSubCategoryName() : null)
                .unitId(product.getUnit() != null ? product.getUnit().getId() : null)
                .unitName(product.getUnit() != null ? product.getUnit().getUnitName() : null)
                .dosageForm(product.getDosageForm())
                .strength(product.getStrength())
                .drugSchedule(product.getDrugSchedule())
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
                .isPrescriptionRequired(product.getIsPrescriptionRequired())
                .isActive(product.getIsActive())
                .isDiscontinued(product.getIsDiscontinued())
                .isNarcotic(product.getIsNarcotic())
                .isRefrigerated(product.getIsRefrigerated())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(UpdateProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }

        if (request.getProductName() != null) {
            product.setProductName(request.getProductName());
        }
        if (request.getGenericName() != null) {
            product.setGenericName(request.getGenericName());
        }
        if (request.getDosageForm() != null) {
            product.setDosageForm(request.getDosageForm());
        }
        if (request.getStrength() != null) {
            product.setStrength(request.getStrength());
        }
        if (request.getDrugSchedule() != null) {
            product.setDrugSchedule(request.getDrugSchedule());
        }
        if (request.getManufacturer() != null) {
            product.setManufacturer(request.getManufacturer());
        }
        if (request.getSupplier() != null) {
            product.setSupplier(request.getSupplier());
        }
        if (request.getBarcode() != null) {
            product.setBarcode(request.getBarcode());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getCostPrice() != null) {
            product.setCostPrice(request.getCostPrice());
        }
        if (request.getSellingPrice() != null) {
            product.setSellingPrice(request.getSellingPrice());
        }
        if (request.getMrp() != null) {
            product.setMrp(request.getMrp());
        }
        if (request.getProfitMargin() != null) {
            product.setProfitMargin(request.getProfitMargin());
        }
        if (request.getGstRate() != null) {
            product.setGstRate(request.getGstRate());
        }
        if (request.getReorderLevel() != null) {
            product.setReorderLevel(request.getReorderLevel());
        }
        if (request.getMinimumStock() != null) {
            product.setMinimumStock(request.getMinimumStock());
        }
        if (request.getMaximumStock() != null) {
            product.setMaximumStock(request.getMaximumStock());
        }
        if (request.getIsPrescriptionRequired() != null) {
            product.setIsPrescriptionRequired(request.getIsPrescriptionRequired());
        }
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }
        if (request.getIsDiscontinued() != null) {
            product.setIsDiscontinued(request.getIsDiscontinued());
        }
        if (request.getIsNarcotic() != null) {
            product.setIsNarcotic(request.getIsNarcotic());
        }
        if (request.getIsRefrigerated() != null) {
            product.setIsRefrigerated(request.getIsRefrigerated());
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
                .subCategoryCount(category.getSubCategories() != null ? category.getSubCategories().size() : 0)
                .productCount(category.getProducts() != null ? category.getProducts().size() : 0)
                .subCategories(category.getSubCategories() != null ?
                        category.getSubCategories().stream()
                                .map(this::toSubCategoryResponse)
                                .collect(Collectors.toList()) : null)
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
