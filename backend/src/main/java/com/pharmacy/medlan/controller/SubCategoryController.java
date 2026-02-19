package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.product.SubCategoryResponse;
import com.pharmacy.medlan.service.product.SubCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sub-categories")
@RequiredArgsConstructor
@Tag(name = "Sub Categories", description = "Product sub-category management APIs")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    @PostMapping
    @Operation(summary = "Create sub-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<SubCategoryResponse>> create(
            @RequestParam Long categoryId,
            @RequestParam String subCategoryName,
            @RequestParam String subCategoryCode) {
        SubCategoryResponse response = subCategoryService.createSubCategory(categoryId, subCategoryName, subCategoryCode);
        return ResponseEntity.ok(ApiResponse.success("Sub-category created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update sub-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<SubCategoryResponse>> update(
            @PathVariable Long id,
            @RequestParam String subCategoryName) {
        SubCategoryResponse response = subCategoryService.updateSubCategory(id, subCategoryName);
        return ResponseEntity.ok(ApiResponse.success("Sub-category updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sub-category by ID")
    public ResponseEntity<ApiResponse<SubCategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(subCategoryService.getSubCategoryById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all sub-categories")
    public ResponseEntity<ApiResponse<List<SubCategoryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(subCategoryService.getAllSubCategories()));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get sub-categories by category")
    public ResponseEntity<ApiResponse<List<SubCategoryResponse>>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(subCategoryService.getSubCategoriesByCategory(categoryId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete sub-category")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Sub-category deleted successfully"));
    }
}
