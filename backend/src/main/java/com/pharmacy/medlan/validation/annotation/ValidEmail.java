package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.EmailValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Enhanced email validation beyond standard @Email annotation.
 * 
 * Features:
 * - Stricter pattern validation
 * - Optional domain whitelist/blacklist
 * - Disposable email detection
 * - Length limits
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
@Documented
public @interface ValidEmail {
    
    String message() default "Invalid email format";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow empty values
     */
    boolean allowEmpty() default true;
    
    /**
     * Block disposable email providers
     */
    boolean blockDisposable() default false;
    
    /**
     * Maximum allowed length
     */
    int maxLength() default 254;
    
    /**
     * Allowed domains (empty means all domains allowed)
     */
    String[] allowedDomains() default {};
}
