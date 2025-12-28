package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.ValidPincode;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Validator for Indian Pincode (PIN - Postal Index Number).
 * 
 * Valid pincodes:
 * - Exactly 6 digits
 * - First digit between 1-8 (no region starts with 0 or 9)
 * - Cannot be all same digits
 * - Cannot be sequential (123456)
 */
public class PincodeValidator implements ConstraintValidator<ValidPincode, String> {

    private boolean allowEmpty;
    private Set<Integer> allowedRegions;

    @Override
    public void initialize(ValidPincode constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.allowedRegions = Arrays.stream(constraintAnnotation.allowedRegions())
                .boxed()
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(String pincode, ConstraintValidatorContext context) {
        if (pincode == null || pincode.trim().isEmpty()) {
            return allowEmpty;
        }

        String cleaned = pincode.trim();

        // Must be exactly 6 digits
        if (!cleaned.matches("^[1-8]\\d{5}$")) {
            customMessage(context, "Pincode must be 6 digits and start with 1-8");
            return false;
        }

        int firstDigit = Character.getNumericValue(cleaned.charAt(0));

        // Validate region if restrictions specified
        if (!allowedRegions.isEmpty() && !allowedRegions.contains(firstDigit)) {
            customMessage(context, "Pincode region not allowed");
            return false;
        }

        // Check for invalid patterns
        if (isAllSameDigits(cleaned)) {
            customMessage(context, "Invalid pincode pattern");
            return false;
        }

        if (isSequential(cleaned)) {
            customMessage(context, "Invalid pincode pattern");
            return false;
        }

        return true;
    }

    private boolean isAllSameDigits(String pincode) {
        char first = pincode.charAt(0);
        return pincode.chars().allMatch(c -> c == first);
    }

    private boolean isSequential(String pincode) {
        // Check ascending sequence
        if (pincode.equals("123456")) return true;
        // Check descending sequence
        if (pincode.equals("654321")) return true;
        return false;
    }

    private void customMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }

    /**
     * Get region name from pincode
     */
    public static String getRegionName(String pincode) {
        if (pincode == null || pincode.length() < 1) {
            return "Unknown";
        }
        
        char firstDigit = pincode.charAt(0);
        return switch (firstDigit) {
            case '1' -> "Northern Region (Delhi, Punjab, Haryana, HP, J&K)";
            case '2' -> "Northern Region (Uttar Pradesh, Uttarakhand)";
            case '3' -> "Western Region (Rajasthan, Gujarat)";
            case '4' -> "Western Region (Maharashtra, Goa, MP, Chhattisgarh)";
            case '5' -> "Southern Region (Andhra Pradesh, Telangana, Karnataka)";
            case '6' -> "Southern Region (Tamil Nadu, Kerala)";
            case '7' -> "Eastern Region (West Bengal, Odisha, Northeast)";
            case '8' -> "Eastern Region (Bihar, Jharkhand)";
            default -> "Unknown Region";
        };
    }

    /**
     * Get state hints from pincode
     */
    public static String[] getPossibleStates(String pincode) {
        if (pincode == null || pincode.length() < 2) {
            return new String[]{"Unknown"};
        }
        
        String prefix = pincode.substring(0, 2);
        return switch (prefix) {
            case "11" -> new String[]{"Delhi"};
            case "12", "13" -> new String[]{"Haryana"};
            case "14", "15", "16" -> new String[]{"Punjab"};
            case "17" -> new String[]{"Himachal Pradesh"};
            case "18", "19" -> new String[]{"Jammu & Kashmir"};
            case "20", "21", "22", "23", "24", "25", "26", "27", "28" -> new String[]{"Uttar Pradesh"};
            case "30", "31", "32", "33", "34" -> new String[]{"Rajasthan"};
            case "36", "37", "38", "39" -> new String[]{"Gujarat"};
            case "40", "41", "42", "43", "44" -> new String[]{"Maharashtra"};
            case "45", "46", "47", "48", "49" -> new String[]{"Madhya Pradesh"};
            case "50", "51", "52" -> new String[]{"Telangana", "Andhra Pradesh"};
            case "53" -> new String[]{"Andhra Pradesh"};
            case "56", "57", "58", "59" -> new String[]{"Karnataka"};
            case "60", "61", "62", "63", "64" -> new String[]{"Tamil Nadu"};
            case "67", "68", "69" -> new String[]{"Kerala"};
            case "70", "71", "72", "73", "74" -> new String[]{"West Bengal"};
            case "75", "76", "77" -> new String[]{"Odisha"};
            case "78" -> new String[]{"Assam"};
            case "79" -> new String[]{"Northeastern States"};
            case "80", "81", "82", "83", "84", "85" -> new String[]{"Bihar", "Jharkhand"};
            default -> new String[]{"Unknown"};
        };
    }
}
