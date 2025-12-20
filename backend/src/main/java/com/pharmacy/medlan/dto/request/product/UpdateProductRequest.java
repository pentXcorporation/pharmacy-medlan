package com.pharmacy.medlan.dto.request.product;

import com.pharmacy.medlan.enums.DosageForm;
import com.pharmacy.medlan.enums.DrugSchedule;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String productName;

    @Size(max = 200, message = "Generic name must not exceed 200 characters")
    private String genericName;

    private Long categoryId;

    private Long subCategoryId;

    private Long unitId;

    private DosageForm dosageForm;

    @Size(max = 100, message = "Strength must not exceed 100 characters")
    private String strength;

    private DrugSchedule drugSchedule;

    @Size(max = 200, message = "Manufacturer must not exceed 200 characters")
    private String manufacturer;

    @Size(max = 200, message = "Supplier must not exceed 200 characters")
    private String supplier;

    @Size(max = 200, message = "Barcode must not exceed 200 characters")
    private String barcode;

    private String description;

    // Pricing
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;
    private BigDecimal profitMargin;
    private BigDecimal gstRate;
    private Long taxCategoryId;

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
}
