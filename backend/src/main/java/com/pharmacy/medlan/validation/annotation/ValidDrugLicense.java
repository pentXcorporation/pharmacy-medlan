package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.DrugLicenseValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates Indian Drug License Number format.
 * 
 * Common formats:
 * - Retail Drug License: 20B/XXX/XXX or similar
 * - Wholesale Drug License: 21B/XXX/XXX or similar
 * 
 * Format varies by state but generally contains:
 * - License type code
 * - District/Division code
 * - Serial number
 * - Year (sometimes)
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DrugLicenseValidator.class)
@Documented
public @interface ValidDrugLicense {
    
    String message() default "Invalid drug license number format";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow empty values
     */
    boolean allowEmpty() default true;
    
    /**
     * License type (RETAIL, WHOLESALE, BOTH)
     */
    LicenseType type() default LicenseType.BOTH;
    
    enum LicenseType {
        RETAIL,      // Form 20/21
        WHOLESALE,   // Form 20B/21B
        BOTH
    }
}
