package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByProductCode(String productCode);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySubCategoryId(Long subCategoryId);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
            "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.genericName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(@Param("search") String search);

    @Query("SELECT p FROM Product p JOIN p.branchInventories bi " +
            "WHERE bi.branch.id = :branchId AND bi.quantityAvailable < p.reorderLevel")
    List<Product> findLowStockProducts(@Param("branchId") Long branchId);
    
    /**
     * Find all products that have inventory in a specific branch
     */
    @Query("SELECT DISTINCT p FROM Product p JOIN p.branchInventories bi WHERE bi.branch.id = :branchId")
    List<Product> findByBranchId(@Param("branchId") Long branchId);

    boolean existsByProductCode(String productCode);
    boolean existsByBarcode(String barcode);
}