package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.ProductMapper;
import com.pharmacy.medlan.model.product.Category;
import com.pharmacy.medlan.model.product.SubCategory;
import com.pharmacy.medlan.repository.product.CategoryRepository;
import com.pharmacy.medlan.repository.product.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubCategoryServiceImpl implements SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public SubCategoryResponse createSubCategory(Long categoryId, String subCategoryName, String subCategoryCode) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        SubCategory subCategory = SubCategory.builder()
                .category(category)
                .subCategoryName(subCategoryName)
                .subCategoryCode(subCategoryCode)
                .isActive(true)
                .build();

        SubCategory saved = subCategoryRepository.save(subCategory);
        return productMapper.toSubCategoryResponse(saved);
    }

    @Override
    @Transactional
    public SubCategoryResponse updateSubCategory(Long id, String subCategoryName) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));

        subCategory.setSubCategoryName(subCategoryName);
        SubCategory updated = subCategoryRepository.save(subCategory);
        return productMapper.toSubCategoryResponse(updated);
    }

    @Override
    public SubCategoryResponse getSubCategoryById(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
        return productMapper.toSubCategoryResponse(subCategory);
    }

    @Override
    public List<SubCategoryResponse> getAllSubCategories() {
        return subCategoryRepository.findAll()
                .stream()
                .map(productMapper::toSubCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubCategoryResponse> getSubCategoriesByCategory(Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(productMapper::toSubCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSubCategory(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
        subCategory.setDeleted(true);
        subCategoryRepository.save(subCategory);
    }
}