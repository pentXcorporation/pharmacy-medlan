package com.pharmacy.medlan.enums;

import java.math.BigDecimal;

/**
 * Enum representing different product types in the pharmacy system
 * Each type has its own code prefix and default GST rate
 */
public enum ProductType {
    
    MEDICAL("MED", BigDecimal.valueOf(12.00), "Medical/Pharmaceutical Products"),
    SUPPLEMENT("SUP", BigDecimal.valueOf(18.00), "Supplements & Vitamins"),
    FOOD("FOOD", BigDecimal.valueOf(12.00), "Food & Beverages"),
    BABY_CARE("BABY", BigDecimal.valueOf(18.00), "Baby Care Products"),
    COSMETIC("COSM", BigDecimal.valueOf(18.00), "Cosmetics & Personal Care"),
    MEDICAL_EQUIPMENT("EQUIP", BigDecimal.valueOf(12.00), "Medical Equipment & Devices"),
    SURGICAL("SURG", BigDecimal.valueOf(12.00), "Surgical & First Aid"),
    AYURVEDIC("AYU", BigDecimal.valueOf(12.00), "Ayurvedic & Herbal"),
    HOMEOPATHIC("HOMO", BigDecimal.valueOf(12.00), "Homeopathic Medicine"),
    GENERAL("GEN", BigDecimal.valueOf(12.00), "General Items");
    
    private final String prefix;
    private final BigDecimal defaultGstRate;
    private final String displayName;
    
    ProductType(String prefix, BigDecimal defaultGstRate, String displayName) {
        this.prefix = prefix;
        this.defaultGstRate = defaultGstRate;
        this.displayName = displayName;
    }
    
    /**
     * Get the code prefix for this product type
     * Used in product code generation (e.g., "MED-00001")
     */
    public String getPrefix() {
        return prefix;
    }
    
    /**
     * Get the default GST rate for this product type
     * Based on Indian GST regulations
     */
    public BigDecimal getDefaultGstRate() {
        return defaultGstRate;
    }
    
    /**
     * Get the display name for this product type
     */
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * Get ProductType from prefix code
     */
    public static ProductType fromPrefix(String prefix) {
        for (ProductType type : values()) {
            if (type.prefix.equals(prefix)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown product type prefix: " + prefix);
    }
    
    /**
     * Check if this product type requires medical-specific fields
     */
    public boolean isMedicalType() {
        return this == MEDICAL || this == AYURVEDIC || this == HOMEOPATHIC;
    }
    
    /**
     * Check if this product type requires food-specific regulations
     */
    public boolean requiresFoodLicense() {
        return this == FOOD || this == SUPPLEMENT;
    }
}
