package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.PincodeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates Indian Pincode (Postal Index Number).
 * 
 * Format: 6 digits
 * - First digit: Region (1-8)
 * - Second digit: Sub-region
 * - Third digit: District
 * - Last 3 digits: Post office
 * 
 * First digit mapping:
 * 1 - Delhi, Haryana, Punjab, HP, J&K
 * 2 - UP, Uttarakhand
 * 3 - Rajasthan, Gujarat
 * 4 - Maharashtra, Goa, MP, Chhattisgarh
 * 5 - Andhra Pradesh, Telangana, Karnataka
 * 6 - Tamil Nadu, Kerala
 * 7 - West Bengal, Odisha, Northeastern states
 * 8 - Bihar, Jharkhand
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PincodeValidator.class)
@Documented
public @interface ValidPincode {
    
    String message() default "Invalid pincode. Must be a valid 6-digit Indian pincode";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow empty values
     */
    boolean allowEmpty() default true;
    
    /**
     * Allowed region codes (first digit). Empty = all regions allowed
     */
    int[] allowedRegions() default {};
}
