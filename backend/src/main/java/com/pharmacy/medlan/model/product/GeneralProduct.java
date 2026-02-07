package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.ProductType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * General Product Entity
 * Represents miscellaneous pharmacy retail items that don't fit other categories
 */
@Entity
@DiscriminatorValue("GENERAL")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class GeneralProduct extends Product {

    @Column(name = "product_category", length = 100)
    private String productCategory; // Sanitary, Hygiene, Accessories, etc.

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Column(name = "material", length = 200)
    private String material;

    @Column(name = "size", length = 100)
    private String size;

    @Column(name = "pack_quantity")
    private Integer packQuantity;

    @Override
    public boolean isValid() {
        // General products have minimal validation requirements
        return true;
    }

    @Override
    public ProductType getProductType() {
        return ProductType.GENERAL;
    }

    /**
     * Get product category description
     */
    public String getCategoryDescription() {
        if (productCategory != null && !productCategory.trim().isEmpty()) {
            return productCategory;
        }
        return "General retail item";
    }

    /**
     * Get pack information
     */
    public String getPackInfo() {
        if (packQuantity != null && packQuantity > 0) {
            return String.format("Pack of %d", packQuantity);
        }
        return "Single unit";
    }
}
