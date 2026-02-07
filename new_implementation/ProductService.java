package com.pharmacy.service;

import com.pharmacy.model.*;
import com.pharmacy.repository.*;
import com.pharmacy.dto.ProductDTO;
import com.pharmacy.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Product Service - handles business logic for all product types
 */
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private MedicalProductRepository medicalProductRepository;
    
    @Autowired
    private FoodProductRepository foodProductRepository;
    
    @Autowired
    private CosmeticProductRepository cosmeticProductRepository;
    
    @Autowired
    private SupplementProductRepository supplementProductRepository;
    
    @Autowired
    private GeneralProductRepository generalProductRepository;
    
    /**
     * Create a new product based on type
     */
    public Product createProduct(ProductDTO dto) {
        // Validate product code uniqueness
        if (productRepository.findByProductCodeAndDeletedFalse(dto.getProductCode()).isPresent()) {
            throw new ValidationException("Product code already exists: " + dto.getProductCode());
        }
        
        Product product;
        
        // Create appropriate product type
        switch (dto.getProductType()) {
            case MEDICAL:
                product = createMedicalProduct(dto);
                break;
            case FOOD:
                product = createFoodProduct(dto);
                break;
            case COSMETIC:
                product = createCosmeticProduct(dto);
                break;
            case SUPPLEMENT:
                product = createSupplementProduct(dto);
                break;
            case GENERAL:
                product = createGeneralProduct(dto);
                break;
            default:
                throw new ValidationException("Invalid product type: " + dto.getProductType());
        }
        
        // Validate before saving
        if (!product.isValid()) {
            throw new ValidationException("Product validation failed for: " + dto.getProductName());
        }
        
        return productRepository.save(product);
    }
    
    /**
     * Create medical product
     */
    private MedicalProduct createMedicalProduct(ProductDTO dto) {
        MedicalProduct product = new MedicalProduct();
        setCommonFields(product, dto);
        
        // Set medical-specific fields
        product.setGenericName(dto.getGenericName());
        product.setStrength(dto.getStrength());
        product.setDosageForm(dto.getDosageForm());
        product.setDrugSchedule(dto.getDrugSchedule());
        product.setIsNarcotic(dto.getIsNarcotic());
        product.setIsPrescriptionRequired(dto.getIsPrescriptionRequired());
        product.setIsRefrigerated(dto.getIsRefrigerated());
        
        return product;
    }
    
    /**
     * Create food product
     */
    private FoodProduct createFoodProduct(ProductDTO dto) {
        FoodProduct product = new FoodProduct();
        setCommonFields(product, dto);
        
        // Set food-specific fields
        product.setIngredients(dto.getIngredients());
        product.setNutritionalInfo(dto.getNutritionalInfo());
        product.setAllergenInfo(dto.getAllergenInfo());
        product.setShelfLifeDays(dto.getShelfLifeDays());
        product.setIsOrganic(dto.getIsOrganic());
        product.setIsVegan(dto.getIsVegan());
        product.setIsVegetarian(dto.getIsVegetarian());
        product.setIsGlutenFree(dto.getIsGlutenFree());
        
        return product;
    }
    
    /**
     * Create cosmetic product
     */
    private CosmeticProduct createCosmeticProduct(ProductDTO dto) {
        CosmeticProduct product = new CosmeticProduct();
        setCommonFields(product, dto);
        
        // Set cosmetic-specific fields
        product.setSkinType(dto.getSkinType());
        product.setUsageInstructions(dto.getUsageInstructions());
        product.setIngredients(dto.getIngredients());
        product.setDermatologicallyTested(dto.getDermatologicallyTested());
        product.setIsParabenFree(dto.getIsParabenFree());
        product.setIsCrueltyFree(dto.getIsCrueltyFree());
        product.setSpfRating(dto.getSpfRating());
        
        return product;
    }
    
    /**
     * Create supplement product
     */
    private SupplementProduct createSupplementProduct(ProductDTO dto) {
        SupplementProduct product = new SupplementProduct();
        setCommonFields(product, dto);
        
        // Set supplement-specific fields
        product.setSupplementType(dto.getSupplementType());
        product.setActiveIngredients(dto.getActiveIngredients());
        product.setDosageInstructions(dto.getDosageInstructions());
        product.setServingSize(dto.getServingSize());
        product.setAgeGroup(dto.getAgeGroup());
        
        return product;
    }
    
    /**
     * Create general product
     */
    private GeneralProduct createGeneralProduct(ProductDTO dto) {
        GeneralProduct product = new GeneralProduct();
        setCommonFields(product, dto);
        
        // Set general-specific fields
        product.setProductCategoryName(dto.getProductCategoryName());
        product.setUsageInstructions(dto.getUsageInstructions());
        product.setWarrantyMonths(dto.getWarrantyMonths());
        product.setIsReturnable(dto.getIsReturnable());
        
        return product;
    }
    
    /**
     * Set common fields for all product types
     */
    private void setCommonFields(Product product, ProductDTO dto) {
        product.setProductCode(dto.getProductCode());
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setBarcode(dto.getBarcode());
        product.setManufacturer(dto.getManufacturer());
        product.setSupplier(dto.getSupplier());
        product.setCostPrice(dto.getCostPrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setMrp(dto.getMrp());
        product.setGstRate(dto.getGstRate());
        product.setMinimumStock(dto.getMinimumStock());
        product.setMaximumStock(dto.getMaximumStock());
        product.setReorderLevel(dto.getReorderLevel());
        product.setIsActive(dto.getIsActive());
        product.setCreatedBy(dto.getCreatedBy());
        product.setLastModifiedBy(dto.getCreatedBy());
    }
    
    /**
     * Find product by ID
     */
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id)
                .filter(p -> !p.getDeleted());
    }
    
    /**
     * Find all active products
     */
    public List<Product> findAllActive() {
        return productRepository.findByIsActiveTrueAndDeletedFalse();
    }
    
    /**
     * Search products by name
     */
    public List<Product> searchByName(String name) {
        return productRepository.searchByName(name);
    }
    
    /**
     * Get medical products requiring prescription
     */
    public List<MedicalProduct> getPrescriptionProducts() {
        return medicalProductRepository.findByIsPrescriptionRequiredTrueAndDeletedFalse();
    }
    
    /**
     * Get controlled substances (narcotics and scheduled drugs)
     */
    public List<MedicalProduct> getControlledSubstances() {
        return medicalProductRepository.findControlledSubstances();
    }
    
    /**
     * Get food products expiring soon
     */
    public List<FoodProduct> getFoodProductsExpiringSoon(int days) {
        return foodProductRepository.findExpiringSoon(days);
    }
    
    /**
     * Get vegan food products
     */
    public List<FoodProduct> getVeganProducts() {
        return foodProductRepository.findByIsVeganTrueAndDeletedFalse();
    }
    
    /**
     * Get cosmetics for specific skin type
     */
    public List<CosmeticProduct> getCosmeticsBySkinType(String skinType) {
        return cosmeticProductRepository.findBySkinTypeAndDeletedFalse(skinType);
    }
    
    /**
     * Get natural/organic cosmetics
     */
    public List<CosmeticProduct> getNaturalCosmetics() {
        return cosmeticProductRepository.findNaturalProducts();
    }
    
    /**
     * Update product
     */
    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Product not found: " + id));
        
        if (product.getDeleted()) {
            throw new ValidationException("Cannot update deleted product: " + id);
        }
        
        // Update common fields
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setCostPrice(dto.getCostPrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setMrp(dto.getMrp());
        product.setLastModifiedBy(dto.getLastModifiedBy());
        
        // Update type-specific fields based on product type
        updateTypeSpecificFields(product, dto);
        
        if (!product.isValid()) {
            throw new ValidationException("Product validation failed after update");
        }
        
        return productRepository.save(product);
    }
    
    /**
     * Update type-specific fields
     */
    private void updateTypeSpecificFields(Product product, ProductDTO dto) {
        if (product instanceof MedicalProduct) {
            MedicalProduct mp = (MedicalProduct) product;
            mp.setGenericName(dto.getGenericName());
            mp.setStrength(dto.getStrength());
            mp.setDosageForm(dto.getDosageForm());
        } else if (product instanceof FoodProduct) {
            FoodProduct fp = (FoodProduct) product;
            fp.setIngredients(dto.getIngredients());
            fp.setAllergenInfo(dto.getAllergenInfo());
            fp.setShelfLifeDays(dto.getShelfLifeDays());
        } else if (product instanceof CosmeticProduct) {
            CosmeticProduct cp = (CosmeticProduct) product;
            cp.setSkinType(dto.getSkinType());
            cp.setUsageInstructions(dto.getUsageInstructions());
        }
        // Add other product types as needed
    }
    
    /**
     * Soft delete product
     */
    public void deleteProduct(Long id, String deletedBy) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Product not found: " + id));
        
        product.setDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        product.setDeletedBy(deletedBy);
        
        productRepository.save(product);
    }
    
    /**
     * Activate/Deactivate product
     */
    public void toggleProductStatus(Long id, boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Product not found: " + id));
        
        product.setIsActive(isActive);
        productRepository.save(product);
    }
    
    /**
     * Get products below reorder level
     */
    public List<Product> getProductsBelowReorderLevel(Long branchId) {
        return productRepository.findProductsBelowReorderLevel(branchId);
    }
    
    /**
     * Check if product requires special handling
     */
    public boolean requiresSpecialHandling(Long productId) {
        Product product = findById(productId)
                .orElseThrow(() -> new ValidationException("Product not found: " + productId));
        
        if (product instanceof MedicalProduct) {
            MedicalProduct mp = (MedicalProduct) product;
            return mp.requiresRefrigeration() || mp.isControlledSubstance();
        }
        
        return false;
    }
}
