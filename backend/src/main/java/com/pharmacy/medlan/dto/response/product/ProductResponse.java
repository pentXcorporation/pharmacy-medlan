package com.pharmacy.medlan.dto.response.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String productCode;
    private String productName;
    private String genericName;

    // Category info
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subCategoryName;
    private Long unitId;
    private String unitName;

    private DosageForm dosageForm;
    private String strength;
    private DrugSchedule drugSchedule;
    private String manufacturer;
    private String supplier;
    private String barcode;
    private String description;

    // Pricing
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;
    private BigDecimal profitMargin;
    private BigDecimal gstRate;
    private Long taxCategoryId;
    private String taxCategoryName;

    // Inventory thresholds
    private Integer reorderLevel;
    private Integer minimumStock;
    private Integer maximumStock;

    // Flags
    private Boolean isPrescriptionRequired;
    private Boolean isActive;
    private Boolean isDiscontinued;
    private Boolean isNarcotic;
    private Boolean isRefrigerated;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
