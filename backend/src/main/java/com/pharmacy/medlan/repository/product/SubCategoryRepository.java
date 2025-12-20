package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    Optional<SubCategory> findBySubCategoryName(String subCategoryName);
    Optional<SubCategory> findBySubCategoryCode(String subCategoryCode);
    List<SubCategory> findByCategoryId(Long categoryId);
    List<SubCategory> findByIsActiveTrue();
    boolean existsBySubCategoryName(String subCategoryName);
}
