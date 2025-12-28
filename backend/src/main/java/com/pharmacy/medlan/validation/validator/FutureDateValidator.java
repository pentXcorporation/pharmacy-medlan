package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.FutureDate;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.Date;

/**
 * Validator for future date constraints.
 * Supports: LocalDate, LocalDateTime, ZonedDateTime, Date
 */
public class FutureDateValidator implements ConstraintValidator<FutureDate, Object> {

    private boolean allowNull;
    private boolean allowToday;
    private int minDaysInFuture;
    private int maxDaysInFuture;

    @Override
    public void initialize(FutureDate constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
        this.allowToday = constraintAnnotation.allowToday();
        this.minDaysInFuture = constraintAnnotation.minDaysInFuture();
        this.maxDaysInFuture = constraintAnnotation.maxDaysInFuture();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }

        LocalDate dateToValidate = extractDate(value);
        if (dateToValidate == null) {
            return false;
        }

        LocalDate today = LocalDate.now();
        long daysFromToday = ChronoUnit.DAYS.between(today, dateToValidate);

        // Check if date is in the future (or today if allowed)
        if (allowToday) {
            if (dateToValidate.isBefore(today)) {
                customMessage(context, "Date must be today or in the future");
                return false;
            }
        } else {
            if (!dateToValidate.isAfter(today)) {
                customMessage(context, "Date must be in the future");
                return false;
            }
        }

        // Check minimum days in future
        if (minDaysInFuture > 0 && daysFromToday < minDaysInFuture) {
            customMessage(context, "Date must be at least " + minDaysInFuture + " days in the future");
            return false;
        }

        // Check maximum days in future
        if (maxDaysInFuture > 0 && daysFromToday > maxDaysInFuture) {
            customMessage(context, "Date must be within " + maxDaysInFuture + " days from today");
            return false;
        }

        return true;
    }

    private LocalDate extractDate(Object value) {
        if (value instanceof LocalDate) {
            return (LocalDate) value;
        }
        if (value instanceof LocalDateTime) {
            return ((LocalDateTime) value).toLocalDate();
        }
        if (value instanceof ZonedDateTime) {
            return ((ZonedDateTime) value).toLocalDate();
        }
        if (value instanceof Date) {
            return new java.sql.Date(((Date) value).getTime()).toLocalDate();
        }
        if (value instanceof java.sql.Date) {
            return ((java.sql.Date) value).toLocalDate();
        }
        return null;
    }

    private void customMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }
}
