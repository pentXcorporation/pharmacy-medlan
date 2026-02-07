package com.pharmacy.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Base Product Entity using Single Table Inheritance
 * This approach keeps all product types in one table with a discriminator column
 */
@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "product_type", discriminatorType = DiscriminatorType.STRING)
@Data
public abstract class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Version
    private Long version;
    
    // Audit fields
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_modified_by", nullable = false)
    private String lastModifiedBy;
    
    @Column(nullable = false)
    private Boolean deleted = false;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "deleted_by")
    private String deletedBy;
    
    // Common product fields
    @Column(name = "product_code", nullable = false, unique = true, length = 50)
    private String productCode;
    
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 200)
    private String barcode;
    
    @Column(length = 200)
    private String manufacturer;
    
    @Column(length = 200)
    private String supplier;
    
    // Pricing
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal mrp;
    
    @Column(name = "profit_margin", precision = 5, scale = 2)
    private BigDecimal profitMargin;
    
    @Column(name = "gst_rate", precision = 5, scale = 2)
    private BigDecimal gstRate;
    
    // Stock management
    @Column(name = "minimum_stock", nullable = false)
    private Integer minimumStock = 0;
    
    @Column(name = "maximum_stock", nullable = false)
    private Integer maximumStock = 0;
    
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 0;
    
    // Status flags
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "is_discontinued", nullable = false)
    private Boolean isDiscontinued = false;
    
    // Additional common fields
    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;
    
    @Column(name = "package_dimensions", length = 100)
    private String packageDimensions;
    
    @Column(name = "weight_grams", precision = 10, scale = 2)
    private BigDecimal weightGrams;
    
    // Flexible attributes in JSON format
    @Column(name = "additional_attributes", columnDefinition = "jsonb")
    private String additionalAttributes;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tax_category_id")
    private TaxCategory taxCategory;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Abstract method for validation - each product type implements its own validation
     */
    public abstract boolean isValid();
    
    /**
     * Get the product type as enum
     */
    public abstract ProductType getProductType();
}
