package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.enums.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(CreateProductRequest request);
    ProductResponse updateProduct(Long id, UpdateProductRequest request);
    ProductResponse getProductById(Long id);
    ProductResponse getProductByCode(String productCode);
    Page<ProductResponse> getAllProducts(Pageable pageable);
    List<ProductResponse> searchProducts(String search);
    List<ProductResponse> getLowStockProducts(Long branchId);
    void deleteProduct(Long id);
    void discontinueProduct(Long id);
    String generateProductCode(ProductType productType);
    
    // Type-specific queries
    List<ProductResponse> getProductsByType(ProductType productType);
    Page<ProductResponse> getProductsByType(ProductType productType, Pageable pageable);
    Long countProductsByType(ProductType productType);
}