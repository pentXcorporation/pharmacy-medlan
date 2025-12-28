package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.ValidGSTIN;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;
import java.util.regex.Pattern;

/**
 * Validator for Indian GSTIN (Goods and Services Tax Identification Number).
 * 
 * Format: 15 characters
 * - Positions 1-2: State code (01-37, specific valid codes)
 * - Positions 3-12: PAN number (AAAPZ1234C format)
 * - Position 13: Entity number (1-9, A-Z)
 * - Position 14: 'Z' (default)
 * - Position 15: Check digit (calculated using mod 36)
 */
public class GSTINValidator implements ConstraintValidator<ValidGSTIN, String> {

    // GSTIN Pattern: 2 digits (state) + 10 chars (PAN) + 1 alphanum + Z + 1 alphanum
    private static final Pattern GSTIN_PATTERN = Pattern.compile(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$"
    );
    
    // Valid Indian state codes (01-37 plus special codes)
    private static final Set<String> VALID_STATE_CODES = Set.of(
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37",
            "97", "96" // Special codes for special economic zones
    );

    private boolean allowEmpty;
    private boolean validateCheckDigit;

    @Override
    public void initialize(ValidGSTIN constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.validateCheckDigit = constraintAnnotation.validateCheckDigit();
    }

    @Override
    public boolean isValid(String gstin, ConstraintValidatorContext context) {
        if (gstin == null || gstin.trim().isEmpty()) {
            return allowEmpty;
        }

        String cleanedGstin = gstin.toUpperCase().trim();

        // Check length
        if (cleanedGstin.length() != 15) {
            return false;
        }

        // Check basic pattern
        if (!GSTIN_PATTERN.matcher(cleanedGstin).matches()) {
            return false;
        }

        // Validate state code
        String stateCode = cleanedGstin.substring(0, 2);
        if (!VALID_STATE_CODES.contains(stateCode)) {
            return false;
        }

        // Validate PAN portion (positions 3-12)
        String panPortion = cleanedGstin.substring(2, 12);
        if (!isValidPANFormat(panPortion)) {
            return false;
        }

        // Validate 14th character is 'Z'
        if (cleanedGstin.charAt(13) != 'Z') {
            return false;
        }

        // Validate check digit if strict validation is enabled
        if (validateCheckDigit) {
            return isValidCheckDigit(cleanedGstin);
        }

        return true;
    }

    /**
     * Validates PAN format (first 10 characters of GSTIN)
     * Format: AAAAA9999A
     * - First 5 characters: Letters
     * - Next 4 characters: Numbers
     * - Last character: Letter
     */
    private boolean isValidPANFormat(String pan) {
        if (pan == null || pan.length() != 10) {
            return false;
        }
        
        // First 5 must be letters
        for (int i = 0; i < 5; i++) {
            if (!Character.isLetter(pan.charAt(i))) {
                return false;
            }
        }
        
        // Next 4 must be digits
        for (int i = 5; i < 9; i++) {
            if (!Character.isDigit(pan.charAt(i))) {
                return false;
            }
        }
        
        // Last must be letter
        return Character.isLetter(pan.charAt(9));
    }

    /**
     * Validates GSTIN check digit using mod 36 algorithm
     */
    private boolean isValidCheckDigit(String gstin) {
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int sum = 0;
        
        for (int i = 0; i < 14; i++) {
            int index = chars.indexOf(gstin.charAt(i));
            int factor = (i % 2 == 0) ? 1 : 2;
            int product = index * factor;
            sum += (product / 36) + (product % 36);
        }
        
        int remainder = sum % 36;
        int checkDigit = (36 - remainder) % 36;
        char expectedCheckDigit = chars.charAt(checkDigit);
        
        return gstin.charAt(14) == expectedCheckDigit;
    }

    /**
     * Utility method to extract PAN from GSTIN
     * @param gstin Valid GSTIN
     * @return PAN number
     */
    public static String extractPAN(String gstin) {
        if (gstin == null || gstin.length() != 15) {
            return null;
        }
        return gstin.substring(2, 12);
    }

    /**
     * Utility method to get state name from GSTIN
     * @param gstin Valid GSTIN
     * @return State name or null
     */
    public static String getStateName(String gstin) {
        if (gstin == null || gstin.length() < 2) {
            return null;
        }
        
        String stateCode = gstin.substring(0, 2);
        return switch (stateCode) {
            case "01" -> "Jammu & Kashmir";
            case "02" -> "Himachal Pradesh";
            case "03" -> "Punjab";
            case "04" -> "Chandigarh";
            case "05" -> "Uttarakhand";
            case "06" -> "Haryana";
            case "07" -> "Delhi";
            case "08" -> "Rajasthan";
            case "09" -> "Uttar Pradesh";
            case "10" -> "Bihar";
            case "11" -> "Sikkim";
            case "12" -> "Arunachal Pradesh";
            case "13" -> "Nagaland";
            case "14" -> "Manipur";
            case "15" -> "Mizoram";
            case "16" -> "Tripura";
            case "17" -> "Meghalaya";
            case "18" -> "Assam";
            case "19" -> "West Bengal";
            case "20" -> "Jharkhand";
            case "21" -> "Odisha";
            case "22" -> "Chhattisgarh";
            case "23" -> "Madhya Pradesh";
            case "24" -> "Gujarat";
            case "25" -> "Daman & Diu"; // Now part of Dadra and Nagar Haveli and Daman and Diu
            case "26" -> "Dadra & Nagar Haveli"; // Now part of Dadra and Nagar Haveli and Daman and Diu
            case "27" -> "Maharashtra";
            case "28" -> "Andhra Pradesh (Old)";
            case "29" -> "Karnataka";
            case "30" -> "Goa";
            case "31" -> "Lakshadweep";
            case "32" -> "Kerala";
            case "33" -> "Tamil Nadu";
            case "34" -> "Puducherry";
            case "35" -> "Andaman & Nicobar Islands";
            case "36" -> "Telangana";
            case "37" -> "Andhra Pradesh (New)";
            case "38" -> "Ladakh";
            case "97" -> "Other Territory";
            default -> null;
        };
    }
}
