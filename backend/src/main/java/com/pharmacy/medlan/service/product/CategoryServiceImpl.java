package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.response.product.CategoryResponse;
import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.ProductMapper;
import com.pharmacy.medlan.model.product.Category;
import com.pharmacy.medlan.repository.product.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public CategoryResponse createCategory(String categoryName, String categoryCode, String description) {
        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new DuplicationResourceException("Category name already exists");
        }

        Category category = Category.builder()
                .categoryName(categoryName)
                .categoryCode(categoryCode)
                .description(description)
                .isActive(true)
                .build();

        Category saved = categoryRepository.save(category);
        return productMapper.toCategoryResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, String categoryName, String description) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setCategoryName(categoryName);
        category.setDescription(description);

        Category updated = categoryRepository.save(category);
        return productMapper.toCategoryResponse(updated);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return productMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(productMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(productMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setDeleted(true);
        category.setIsActive(false);
        categoryRepository.save(category);
    }
}