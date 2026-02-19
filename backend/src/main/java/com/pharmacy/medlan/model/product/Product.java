package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import com.pharmacy.medlan.enums.ProductType;
import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
        @Index(name = "idx_product_type", columnList = "product_type"),
        @Index(name = "idx_category_id", columnList = "category_id")
})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "product_type", discriminatorType = DiscriminatorType.STRING, length = 50)
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@ToString(exclude = {"category", "subCategory", "unit", "taxCategory"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public abstract class Product extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "product_code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Product code is required")
    @EqualsAndHashCode.Include
    private String productCode;

    @Column(name = "product_name", nullable = false, length = 200)
    @NotBlank(message = "Product name is required")
    private String productName;

    @Column(name = "generic_name", length = 200)
    private String genericName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "dosage_form", length = 50)
    private DosageForm dosageForm;

    @Column(name = "strength", length = 100)
    private String strength;

    @Enumerated(EnumType.STRING)
    @Column(name = "drug_schedule", length = 20)
    private DrugSchedule drugSchedule;

    @Column(name = "manufacturer", length = 200)
    private String manufacturer;

    @Column(name = "supplier", length = 200)
    private String supplier;

    @Column(name = "barcode", length = 200)
    private String barcode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cost_price", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Cost price must be positive")
    private BigDecimal costPrice;

    @Column(name = "selling_price", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Selling price must be positive")
    private BigDecimal sellingPrice;

    @Column(name = "mrp", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "MRP must be positive")
    private BigDecimal mrp;

    @Column(name = "profit_margin", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal profitMargin = BigDecimal.valueOf(15.00);

    @Column(name = "gst_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal gstRate = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tax_category_id")
    private TaxCategory taxCategory;

    @Column(name = "reorder_level", nullable = false)
    @Min(value = 0, message = "Reorder level must be non-negative")
    @Builder.Default
    private Integer reorderLevel = 10;

    @Column(name = "minimum_stock", nullable = false)
    @Min(value = 0, message = "Minimum stock must be non-negative")
    @Builder.Default
    private Integer minimumStock = 5;

    @Column(name = "maximum_stock", nullable = false)
    @Min(value = 1, message = "Maximum stock must be positive")
    @Builder.Default
    private Integer maximumStock = 1000;

    @Column(name = "is_prescription_required")
    private Boolean isPrescriptionRequired;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_discontinued", nullable = false)
    @Builder.Default
    private Boolean isDiscontinued = false;

    @Column(name = "is_narcotic")
    private Boolean isNarcotic;

    @Column(name = "is_refrigerated")
    private Boolean isRefrigerated;

    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;

    @Column(name = "package_dimensions", length = 200)
    private String packageDimensions;

    @Column(name = "weight_grams")
    @Min(value = 0, message = "Weight must be non-negative")
    private Integer weightGrams;

    @Column(name = "additional_attributes", columnDefinition = "TEXT")
    private String additionalAttributes;

    @OneToMany(mappedBy = "product")
    @Builder.Default
    private List<InventoryBatch> inventoryBatches = new ArrayList<>();

    public abstract boolean isValid();
    public abstract ProductType getProductType();

    public boolean isLowStock(int currentStock) {
        return currentStock <= reorderLevel;
    }

    public boolean requiresPrescription() {
        return Boolean.TRUE.equals(isPrescriptionRequired);
    }
}