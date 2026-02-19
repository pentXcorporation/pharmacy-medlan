package com.pharmacy.medlan.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class StringUtil {

    private StringUtil() {
        // Utility class
    }

    /**
     * Check if a string is null or blank
     */
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Check if a string is not null and not blank
     */
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    /**
     * Capitalize the first letter of a string
     */
    public static String capitalize(String str) {
        if (isBlank(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    /**
     * Capitalize each word in a string
     */
    public static String capitalizeWords(String str) {
        if (isBlank(str)) return str;
        String[] words = str.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!result.isEmpty()) result.append(" ");
            result.append(capitalize(word));
        }
        return result.toString();
    }

    /**
     * Convert a string to a slug (URL-safe format)
     */
    public static String toSlug(String input) {
        if (isBlank(input)) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized)
                .replaceAll("")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s-]+", "-")
                .replaceAll("^-|-$", "");
    }

    /**
     * Truncate a string to the specified length with ellipsis
     */
    public static String truncate(String str, int maxLength) {
        if (isBlank(str) || str.length() <= maxLength) return str;
        return str.substring(0, maxLength - 3) + "...";
    }

    /**
     * Remove all whitespace from a string
     */
    public static String removeWhitespace(String str) {
        if (isBlank(str)) return str;
        return str.replaceAll("\\s+", "");
    }

    /**
     * Mask a string (e.g., for sensitive data), showing only the last N characters
     */
    public static String mask(String str, int visibleChars) {
        if (isBlank(str) || str.length() <= visibleChars) return str;
        int maskedLength = str.length() - visibleChars;
        return "*".repeat(maskedLength) + str.substring(maskedLength);
    }

    /**
     * Generate initials from a full name
     */
    public static String getInitials(String fullName) {
        if (isBlank(fullName)) return "";
        String[] parts = fullName.trim().split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(Character.toUpperCase(part.charAt(0)));
            }
        }
        return initials.toString();
    }

    /**
     * Safe trim that handles null
     */
    public static String safeTrim(String str) {
        return str != null ? str.trim() : null;
    }

    /**
     * Convert camelCase to snake_case
     */
    public static String camelToSnake(String str) {
        if (isBlank(str)) return str;
        return str.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
    }

    /**
     * Convert snake_case to camelCase
     */
    public static String snakeToCamel(String str) {
        if (isBlank(str)) return str;
        StringBuilder result = new StringBuilder();
        boolean capitalizeNext = false;
        for (char c : str.toCharArray()) {
            if (c == '_') {
                capitalizeNext = true;
            } else if (capitalizeNext) {
                result.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }
}
