package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    Optional<Category> findByCategoryName(String categoryName);

    Optional<Category> findByCategoryCode(String categoryCode);

    List<Category> findByIsActiveTrue();

    List<Category> findByIsActiveFalse();

    @Query("SELECT c FROM Category c WHERE " +
            "(LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Category> searchCategories(@Param("search") String search);

    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.categoryName ASC")
    List<Category> findAllActiveOrderByName();

    @Query("SELECT COUNT(c) FROM Category c WHERE c.isActive = true")
    Long countActiveCategories();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.subCategories WHERE c.id = :id")
    Optional<Category> findByIdWithSubCategories(@Param("id") Long id);

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryCode(String categoryCode);
}