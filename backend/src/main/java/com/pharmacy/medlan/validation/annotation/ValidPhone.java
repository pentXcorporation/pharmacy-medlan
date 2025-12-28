package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.PhoneValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates Indian phone number formats:
 * - 10-digit mobile number (e.g., 9876543210)
 * - With country code (e.g., +919876543210 or 919876543210)
 * - Landline formats (e.g., 044-12345678)
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
@Documented
public @interface ValidPhone {
    
    String message() default "Invalid phone number format. Must be a valid Indian phone number";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow empty values
     */
    boolean allowEmpty() default true;
    
    /**
     * Allow landline numbers
     */
    boolean allowLandline() default true;
}
