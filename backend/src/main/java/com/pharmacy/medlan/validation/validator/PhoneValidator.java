package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.ValidPhone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

/**
 * Validator for Indian phone numbers.
 * Supports:
 * - 10-digit mobile: 9876543210, 7876543210, 8876543210, 6876543210
 * - With country code: +919876543210, 919876543210, 0919876543210
 * - Landline: 044-12345678, 011-12345678
 * - With spaces/dashes: 98765 43210, 987-654-3210
 */
public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

    // Indian mobile number starting with 6, 7, 8, or 9
    private static final Pattern MOBILE_PATTERN = Pattern.compile(
            "^(?:\\+?91[\\s.-]?)?[6-9]\\d{9}$"
    );
    
    // Indian landline with STD code
    private static final Pattern LANDLINE_PATTERN = Pattern.compile(
            "^(?:\\+?91[\\s.-]?)?0?[1-9]\\d{1,4}[\\s.-]?\\d{6,8}$"
    );
    
    // Generic pattern allowing spaces and dashes
    private static final Pattern FLEXIBLE_PATTERN = Pattern.compile(
            "^(?:\\+?91)?[\\s.-]?[6-9]\\d{2}[\\s.-]?\\d{3}[\\s.-]?\\d{4}$"
    );

    private boolean allowEmpty;
    private boolean allowLandline;

    @Override
    public void initialize(ValidPhone constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.allowLandline = constraintAnnotation.allowLandline();
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return allowEmpty;
        }

        // Remove all spaces and common separators for validation
        String cleanedPhone = phoneNumber.replaceAll("[\\s.()-]", "");
        
        // Check if it's a valid mobile number
        if (isValidMobile(cleanedPhone)) {
            return true;
        }
        
        // Check landline if allowed
        if (allowLandline && isValidLandline(cleanedPhone)) {
            return true;
        }
        
        // Try flexible pattern
        return FLEXIBLE_PATTERN.matcher(phoneNumber.replaceAll("[\\s.-]", "")).matches();
    }

    private boolean isValidMobile(String phone) {
        // Remove country code prefix if present
        if (phone.startsWith("+91")) {
            phone = phone.substring(3);
        } else if (phone.startsWith("91") && phone.length() > 10) {
            phone = phone.substring(2);
        } else if (phone.startsWith("0") && phone.length() == 11) {
            phone = phone.substring(1);
        }
        
        // Must be 10 digits starting with 6, 7, 8, or 9
        return phone.length() == 10 && 
               phone.matches("[6-9]\\d{9}");
    }

    private boolean isValidLandline(String phone) {
        // Remove country code if present
        if (phone.startsWith("+91")) {
            phone = phone.substring(3);
        } else if (phone.startsWith("91") && phone.length() > 11) {
            phone = phone.substring(2);
        }
        
        // Remove leading 0 if present
        if (phone.startsWith("0")) {
            phone = phone.substring(1);
        }
        
        // Landline: STD code (2-4 digits) + number (6-8 digits) = 8-12 digits total
        return phone.length() >= 8 && phone.length() <= 12 && phone.matches("\\d+");
    }

    /**
     * Utility method to normalize phone number to E.164 format
     * @param phoneNumber The phone number to normalize
     * @return Normalized phone number in +91XXXXXXXXXX format
     */
    public static String normalizeToE164(String phoneNumber) {
        if (phoneNumber == null) return null;
        
        String cleaned = phoneNumber.replaceAll("[\\s.()-]", "");
        
        // Remove country code prefix
        if (cleaned.startsWith("+91")) {
            cleaned = cleaned.substring(3);
        } else if (cleaned.startsWith("91") && cleaned.length() > 10) {
            cleaned = cleaned.substring(2);
        } else if (cleaned.startsWith("0") && cleaned.length() == 11) {
            cleaned = cleaned.substring(1);
        }
        
        // Return in E.164 format
        if (cleaned.length() == 10) {
            return "+91" + cleaned;
        }
        
        return phoneNumber; // Return original if can't normalize
    }
}
