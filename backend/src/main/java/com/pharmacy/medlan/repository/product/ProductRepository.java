package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.enums.ProductType;
import com.pharmacy.medlan.model.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByProductCodeAndDeletedFalse(String productCode);
    Optional<Product> findByBarcodeAndDeletedFalse(String barcode);
    Optional<Product> findByIdAndDeletedFalse(Long id);
    List<Product> findByIsActiveTrueAndDeletedFalse();
    List<Product> findByCategoryIdAndDeletedFalse(Long categoryId);
    List<Product> findBySubCategoryIdAndDeletedFalse(Long subCategoryId);

    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.isActive = true AND " +
            "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.genericName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(@Param("search") String search);

    @Query("SELECT p FROM Product p JOIN p.branchInventories bi " +
            "WHERE p.deleted = false AND bi.branch.id = :branchId AND bi.quantityAvailable < p.reorderLevel")
    List<Product> findLowStockProducts(@Param("branchId") Long branchId);
    
    /**
     * Find all products that have inventory in a specific branch
     */
    @Query("SELECT DISTINCT p FROM Product p JOIN p.branchInventories bi WHERE p.deleted = false AND bi.branch.id = :branchId")
    List<Product> findByBranchId(@Param("branchId") Long branchId);
    
    /**
     * Find all non-deleted products with pagination
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false")
    Page<Product> findAllNonDeleted(Pageable pageable);

    boolean existsByProductCodeAndDeletedFalse(String productCode);
    boolean existsByBarcodeAndDeletedFalse(String barcode);
    
    // Type-specific queries
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND TYPE(p) = :productClass")
    List<Product> findByProductType(@Param("productClass") Class<? extends Product> productClass);
    
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND TYPE(p) = :productClass AND p.isActive = true")
    List<Product> findByProductTypeAndIsActiveTrue(@Param("productClass") Class<? extends Product> productClass);
    
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND TYPE(p) = :productClass")
    Page<Product> findByProductTypePageable(@Param("productClass") Class<? extends Product> productClass, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.deleted = false AND TYPE(p) = :productClass")
    Long countByProductType(@Param("productClass") Class<? extends Product> productClass);
    
    // Keep legacy methods for backward compatibility
    Optional<Product> findByProductCode(String productCode);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySubCategoryId(Long subCategoryId);
    boolean existsByProductCode(String productCode);
    boolean existsByBarcode(String barcode);
}