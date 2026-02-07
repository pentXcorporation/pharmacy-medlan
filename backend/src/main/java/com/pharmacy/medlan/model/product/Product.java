package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import com.pharmacy.medlan.enums.ProductType;
import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_code", columnList = "product_code"),
        @Index(name = "idx_product_name", columnList = "product_name"),
        @Index(name = "idx_barcode", columnList = "barcode"),
        @Index(name = "idx_is_active", columnList = "is_active"),
        @Index(name = "idx_product_type", columnList = "product_type")
})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "product_type", discriminatorType = DiscriminatorType.STRING, length = 50)
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public abstract class Product extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_code", nullable = false, unique = true, length = 50)
    private String productCode; // e.g., "MED-00001"

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "generic_name", length = 200, nullable = true)
    private String genericName; // Scientific/generic name - mainly for medical products

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    // Medical-specific fields (nullable for non-medical products)
    @Enumerated(EnumType.STRING)
    @Column(name = "dosage_form", length = 50, nullable = true)
    private DosageForm dosageForm; // TABLET, CAPSULE, SYRUP, etc.

    @Column(name = "strength", length = 100, nullable = true)
    private String strength; // e.g., "500mg", "10ml"

    @Enumerated(EnumType.STRING)
    @Column(name = "drug_schedule", length = 20, nullable = true)
    private DrugSchedule drugSchedule; // H, H1, G, X (Indian pharmacy regulation)

    @Column(name = "manufacturer", length = 200)
    private String manufacturer;

    @Column(name = "supplier", length = 200)
    private String supplier;

    @Column(name = "barcode", length = 200)
    private String barcode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Pricing
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice; // Last purchase price

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "mrp", precision = 10, scale = 2)
    private BigDecimal mrp; // Maximum Retail Price

    @Column(name = "profit_margin", precision = 5, scale = 2)
    private BigDecimal profitMargin = BigDecimal.valueOf(15.00); // Default 15%

    @Column(name = "gst_rate", precision = 5, scale = 2)
    private BigDecimal gstRate = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tax_category_id")
    private TaxCategory taxCategory;

    // Inventory thresholds
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    @Column(name = "minimum_stock", nullable = false)
    private Integer minimumStock = 5;

    @Column(name = "maximum_stock", nullable = false)
    private Integer maximumStock = 1000;

    // Flags
    @Column(name = "is_prescription_required", nullable = true)
    private Boolean isPrescriptionRequired; // Nullable for non-medical products

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_discontinued", nullable = false)
    private Boolean isDiscontinued = false;

    @Column(name = "is_narcotic", nullable = true)
    private Boolean isNarcotic; // Schedule X drugs - nullable for non-medical

    @Column(name = "is_refrigerated", nullable = true)
    private Boolean isRefrigerated; // Cold storage required - nullable for non-medical

    // Common additional fields for all product types
    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;

    @Column(name = "package_dimensions", length = 200)
    private String packageDimensions; // e.g., "10x5x2 cm"

    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Column(name = "additional_attributes", columnDefinition = "TEXT")
    private String additionalAttributes; // JSON string for flexible attributes

    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    private List<InventoryBatch> inventoryBatches = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private List<BranchInventory> branchInventories = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ProductPricing> pricingHistory = new ArrayList<>();

    /**
     * Validate product type-specific fields
     * Each subclass implements its own validation logic
     */
    public abstract boolean isValid();

    /**
     * Get the product type
     * Each subclass returns its specific type
     */
    public abstract ProductType getProductType();
}