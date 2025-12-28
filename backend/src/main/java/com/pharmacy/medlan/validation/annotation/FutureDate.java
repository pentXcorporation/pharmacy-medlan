package com.pharmacy.medlan.validation.annotation;

import com.pharmacy.medlan.validation.validator.FutureDateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validates that a date is in the future.
 * 
 * Useful for:
 * - Expiry dates
 * - Scheduled dates
 * - Appointment dates
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FutureDateValidator.class)
@Documented
public @interface FutureDate {
    
    String message() default "Date must be in the future";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Allow null values
     */
    boolean allowNull() default true;
    
    /**
     * Allow today's date (future or equal to today)
     */
    boolean allowToday() default false;
    
    /**
     * Minimum days in future
     */
    int minDaysInFuture() default 0;
    
    /**
     * Maximum days in future (0 = no limit)
     */
    int maxDaysInFuture() default 0;
}
