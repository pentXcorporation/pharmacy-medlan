package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.dto.request.product.CreateProductRequest;
import com.pharmacy.medlan.dto.request.product.UpdateProductRequest;
import com.pharmacy.medlan.dto.response.product.ProductResponse;
import com.pharmacy.medlan.enums.ProductType;
import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.exception.ValidationException;
import com.pharmacy.medlan.mapper.ProductMapper;
import com.pharmacy.medlan.model.product.*;
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
    
    // Type-specific repositories
    private final MedicalProductRepository medicalProductRepository;
    private final SupplementProductRepository supplementProductRepository;
    private final FoodProductRepository foodProductRepository;
    private final BabyCareProductRepository babyCareProductRepository;
    private final CosmeticProductRepository cosmeticProductRepository;
    private final MedicalEquipmentProductRepository medicalEquipmentProductRepository;
    private final SurgicalProductRepository surgicalProductRepository;
    private final AyurvedicProductRepository ayurvedicProductRepository;
    private final HomeopathicProductRepository homeopathicProductRepository;
    private final GeneralProductRepository generalProductRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Creating product: {} of type: {}", request.getProductName(), request.getProductType());

        // Validate product type is provided
        if (request.getProductType() == null) {
            throw new ValidationException("Product type is required");
        }

        if (request.getBarcode() != null && productRepository.existsByBarcodeAndDeletedFalse(request.getBarcode())) {
            throw new DuplicationResourceException("Barcode already exists");
        }

        // Create product instance using factory pattern
        Product product = createProductInstance(request.getProductType());
        
        // Map common fields
        productMapper.toEntity(request, product);
        
        // Generate product code based on type
        product.setProductCode(generateProductCode(request.getProductType()));

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
        
        // Set default GST rate based on product type if not provided
        if (product.getGstRate() == null) {
            product.setGstRate(request.getProductType().getDefaultGstRate());
        }

        // Validate product type-specific fields
        if (!product.isValid()) {
            throw new ValidationException("Product validation failed. Missing required fields for " + 
                                        request.getProductType().getDisplayName());
        }

        Product saved = productRepository.save(product);
        log.info("Product created with code: {} and type: {}", saved.getProductCode(), saved.getProductType());

        return productMapper.toResponse(saved);
    }
    
    /**
     * Factory method to create appropriate Product subclass instance
     */
    private Product createProductInstance(ProductType productType) {
        return switch (productType) {
            case MEDICAL -> new MedicalProduct();
            case SUPPLEMENT -> new SupplementProduct();
            case FOOD -> new FoodProduct();
            case BABY_CARE -> new BabyCareProduct();
            case COSMETIC -> new CosmeticProduct();
            case MEDICAL_EQUIPMENT -> new MedicalEquipmentProduct();
            case SURGICAL -> new SurgicalProduct();
            case AYURVEDIC -> new AyurvedicProduct();
            case HOMEOPATHIC -> new HomeopathicProduct();
            case GENERAL -> new GeneralProduct();
        };
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
    public String generateProductCode(ProductType productType) {
        // Get count for specific product type
        Class<? extends Product> productClass = getProductClassByType(productType);
        Long count = productRepository.countByProductType(productClass);
        return String.format("%s-%05d", productType.getPrefix(), count + 1);
    }
    
    /**
     * Get Product class by ProductType
     */
    private Class<? extends Product> getProductClassByType(ProductType productType) {
        return switch (productType) {
            case MEDICAL -> MedicalProduct.class;
            case SUPPLEMENT -> SupplementProduct.class;
            case FOOD -> FoodProduct.class;
            case BABY_CARE -> BabyCareProduct.class;
            case COSMETIC -> CosmeticProduct.class;
            case MEDICAL_EQUIPMENT -> MedicalEquipmentProduct.class;
            case SURGICAL -> SurgicalProduct.class;
            case AYURVEDIC -> AyurvedicProduct.class;
            case HOMEOPATHIC -> HomeopathicProduct.class;
            case GENERAL -> GeneralProduct.class;
        };
    }
    
    @Override
    public List<ProductResponse> getProductsByType(ProductType productType) {
        Class<? extends Product> productClass = getProductClassByType(productType);
        List<Product> products = productRepository.findByProductTypeAndIsActiveTrue(productClass);
        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<ProductResponse> getProductsByType(ProductType productType, Pageable pageable) {
        Class<? extends Product> productClass = getProductClassByType(productType);
        return productRepository.findByProductTypePageable(productClass, pageable)
                .map(productMapper::toResponse);
    }
    
    @Override
    public Long countProductsByType(ProductType productType) {
        Class<? extends Product> productClass = getProductClassByType(productType);
        return productRepository.countByProductType(productClass);
    }
}