package com.pharmacy.medlan.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class NumberUtil {

    private NumberUtil() {
        // Utility class
    }

    /**
     * Round a BigDecimal to 2 decimal places
     */
    public static BigDecimal round(BigDecimal value) {
        return round(value, 2);
    }

    /**
     * Round a BigDecimal to the specified number of decimal places
     */
    public static BigDecimal round(BigDecimal value, int decimalPlaces) {
        if (value == null) return BigDecimal.ZERO;
        return value.setScale(decimalPlaces, RoundingMode.HALF_UP);
    }

    /**
     * Calculate percentage: (part / total) * 100
     */
    public static BigDecimal calculatePercentage(BigDecimal part, BigDecimal total) {
        if (total == null || total.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return part.multiply(BigDecimal.valueOf(100)).divide(total, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate profit margin: ((sellingPrice - costPrice) / sellingPrice) * 100
     */
    public static BigDecimal calculateProfitMargin(BigDecimal costPrice, BigDecimal sellingPrice) {
        if (sellingPrice == null || sellingPrice.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return sellingPrice.subtract(costPrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(sellingPrice, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate markup: ((sellingPrice - costPrice) / costPrice) * 100
     */
    public static BigDecimal calculateMarkup(BigDecimal costPrice, BigDecimal sellingPrice) {
        if (costPrice == null || costPrice.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return sellingPrice.subtract(costPrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(costPrice, 2, RoundingMode.HALF_UP);
    }

    /**
     * Check if a BigDecimal is positive
     */
    public static boolean isPositive(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Check if a BigDecimal is zero or null
     */
    public static boolean isZeroOrNull(BigDecimal value) {
        return value == null || value.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Safe addition of two BigDecimals (null-safe)
     */
    public static BigDecimal safeAdd(BigDecimal a, BigDecimal b) {
        BigDecimal first = a != null ? a : BigDecimal.ZERO;
        BigDecimal second = b != null ? b : BigDecimal.ZERO;
        return first.add(second);
    }

    /**
     * Safe subtraction of two BigDecimals (null-safe)
     */
    public static BigDecimal safeSubtract(BigDecimal a, BigDecimal b) {
        BigDecimal first = a != null ? a : BigDecimal.ZERO;
        BigDecimal second = b != null ? b : BigDecimal.ZERO;
        return first.subtract(second);
    }

    /**
     * Convert to BigDecimal safely
     */
    public static BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}
