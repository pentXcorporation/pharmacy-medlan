package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import java.util.List;

public interface SubCategoryService {
    SubCategoryResponse createSubCategory(Long categoryId, String subCategoryName, String subCategoryCode);
    SubCategoryResponse updateSubCategory(Long id, String subCategoryName);
    SubCategoryResponse getSubCategoryById(Long id);
    List<SubCategoryResponse> getAllSubCategories();
    List<SubCategoryResponse> getSubCategoriesByCategory(Long categoryId);
    void deleteSubCategory(Long id);
}