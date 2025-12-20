package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.response.product.CategoryResponse;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(String categoryName, String categoryCode, String description);
    CategoryResponse updateCategory(Long id, String categoryName, String description);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
    List<CategoryResponse> getActiveCategories();
    void deleteCategory(Long id);
}
