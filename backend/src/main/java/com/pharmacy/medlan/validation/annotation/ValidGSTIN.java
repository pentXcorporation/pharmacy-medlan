package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.GSTINValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates Indian GSTIN (Goods and Services Tax Identification Number).
 * 
 * GSTIN Format: 15-character alphanumeric
 * - Characters 1-2: State code (01-37)
 * - Characters 3-12: PAN number
 * - Character 13: Entity number (1-9 or A-Z)
 * - Character 14: 'Z' by default
 * - Character 15: Check digit (0-9 or A-Z)
 * 
 * Example: 27AAPFU0939F1ZV
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GSTINValidator.class)
@Documented
public @interface ValidGSTIN {
    
    String message() default "Invalid GSTIN format. Must be a valid 15-character Indian GSTIN";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow empty values
     */
    boolean allowEmpty() default true;
    
    /**
     * Validate check digit (strict validation)
     */
    boolean validateCheckDigit() default true;
}
