package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.ProductMapper;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.repository.product.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final UnitRepository unitRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Creating product: {}", request.getProductName());

        if (request.getBarcode() != null && productRepository.existsByBarcodeAndDeletedFalse(request.getBarcode())) {
            throw new DuplicationResourceException("Barcode already exists");
        }

        Product product = productMapper.toEntity(request);
        product.setProductCode(generateProductCode());

        if (request.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }

        if (request.getSubCategoryId() != null) {
            product.setSubCategory(subCategoryRepository.findById(request.getSubCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found")));
        }

        if (request.getUnitId() != null) {
            product.setUnit(unitRepository.findById(request.getUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Unit not found")));
        }

        Product saved = productRepository.save(product);
        log.info("Product created with code: {}", saved.getProductCode());

        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        log.info("Updating product: {}", id);

        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        productMapper.updateEntityFromRequest(request, product);

        if (request.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }

        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse getProductByCode(String productCode) {
        Product product = productRepository.findByProductCodeAndDeletedFalse(productCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with code: " + productCode));
        return productMapper.toResponse(product);
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAllNonDeleted(pageable)
                .map(productMapper::toResponse);
    }

    @Override
    public List<ProductResponse> searchProducts(String search) {
        return productRepository.searchProducts(search)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getLowStockProducts(Long branchId) {
        return productRepository.findLowStockProducts(branchId)
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Soft delete the product
        product.setDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        
        // Get current user from security context
        try {
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
            product.setDeletedBy(currentUser);
        } catch (Exception e) {
            product.setDeletedBy("system");
            log.warn("Could not get current user for deletion, using 'system'");
        }
        
        // Also mark as inactive
        product.setIsActive(false);
        
        productRepository.save(product);
        log.info("Product soft deleted: {} by {}", id, product.getDeletedBy());
    }

    @Override
    @Transactional
    public void discontinueProduct(Long id) {
        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setIsDiscontinued(true);
        product.setIsActive(false);
        productRepository.save(product);
        log.info("Product discontinued: {}", id);
    }

    @Override
    public String generateProductCode() {
        Long count = productRepository.count();
        return String.format("MED-%05d", count + 1);
    }
}