package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.ValidDrugLicense;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

/**
 * Validator for Indian Drug License Numbers.
 * 
 * Valid formats (examples):
 * - 20B/KA/2023/0001 (Karnataka retail)
 * - 21B/MH/2023/0001 (Maharashtra wholesale)
 * - DL-20-123456 (Delhi)
 * - FDCA-GJ-20-12345 (Gujarat)
 * - Form variations with state codes
 */
public class DrugLicenseValidator implements ConstraintValidator<ValidDrugLicense, String> {

    // Generic pattern - allows various state formats
    private static final Pattern DRUG_LICENSE_PATTERN = Pattern.compile(
            "^[A-Z0-9]{2,6}[-/][A-Z]{2}[-/]?\\d{2,4}[-/]?\\d{3,6}$|" +  // Standard format
            "^\\d{2}[AB]?[-/][A-Z]{2,4}[-/]\\d{4}[-/]\\d{4,6}$|" +       // Form number based
            "^[A-Z]{2,5}[-/]\\d{2,4}[-/]\\d{4,8}$|" +                    // State prefix format
            "^[A-Z0-9]{5,20}$",                                          // Some states use alphanumeric only
            Pattern.CASE_INSENSITIVE
    );
    
    // Retail license patterns (Form 20, 21)
    private static final Pattern RETAIL_PATTERN = Pattern.compile(
            ".*\\b(20|21)\\b.*",
            Pattern.CASE_INSENSITIVE
    );
    
    // Wholesale license patterns (Form 20B, 21B)
    private static final Pattern WHOLESALE_PATTERN = Pattern.compile(
            ".*\\b(20B|21B)\\b.*",
            Pattern.CASE_INSENSITIVE
    );

    private boolean allowEmpty;
    private ValidDrugLicense.LicenseType type;

    @Override
    public void initialize(ValidDrugLicense constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.type = constraintAnnotation.type();
    }

    @Override
    public boolean isValid(String licenseNumber, ConstraintValidatorContext context) {
        if (licenseNumber == null || licenseNumber.trim().isEmpty()) {
            return allowEmpty;
        }

        String cleaned = licenseNumber.trim().toUpperCase();

        // Check minimum length
        if (cleaned.length() < 5 || cleaned.length() > 30) {
            return false;
        }

        // Basic pattern validation
        if (!DRUG_LICENSE_PATTERN.matcher(cleaned).matches()) {
            // Allow more flexible validation for unrecognized but reasonable formats
            if (!cleaned.matches("^[A-Z0-9\\-/]+$") || cleaned.length() < 5) {
                return false;
            }
        }

        // Type-specific validation
        return switch (type) {
            case RETAIL -> isRetailLicense(cleaned);
            case WHOLESALE -> isWholesaleLicense(cleaned);
            case BOTH -> true; // Already passed basic validation
        };
    }

    private boolean isRetailLicense(String license) {
        // Retail licenses typically have form 20 or 21 (without B suffix)
        return RETAIL_PATTERN.matcher(license).matches() && 
               !WHOLESALE_PATTERN.matcher(license).matches();
    }

    private boolean isWholesaleLicense(String license) {
        // Wholesale licenses have form 20B or 21B
        return WHOLESALE_PATTERN.matcher(license).matches();
    }

    /**
     * Extract license type from license number
     */
    public static String extractLicenseType(String licenseNumber) {
        if (licenseNumber == null) return "UNKNOWN";
        
        String upper = licenseNumber.toUpperCase();
        if (upper.contains("20B") || upper.contains("21B")) {
            return "WHOLESALE";
        } else if (upper.contains("20") || upper.contains("21")) {
            return "RETAIL";
        }
        return "UNKNOWN";
    }
}
