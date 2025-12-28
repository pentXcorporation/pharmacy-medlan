package com.pharmacy.medlan.aspect;

import com.pharmacy.medlan.config.RateLimitConfig;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.validation.annotation.RateLimit;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;

/**
 * Aspect for enforcing rate limits on API endpoints.
 * 
 * Uses the @RateLimit annotation to determine limits and scope.
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitAspect {

    private final RateLimitConfig rateLimitConfig;

    @Around("@annotation(com.pharmacy.medlan.validation.annotation.RateLimit)")
    public Object enforceRateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);

        String bucketKey = getBucketKey(rateLimit, method);
        Bucket bucket = getBucket(bucketKey, rateLimit);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (!probe.isConsumed()) {
            long waitTimeSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            log.warn("Rate limit exceeded for bucket: {}. Retry after {} seconds", bucketKey, waitTimeSeconds);
            throw new BusinessRuleViolationException(
                    String.format("Rate limit exceeded. Please try again in %d seconds.", waitTimeSeconds)
            );
        }

        log.debug("Rate limit check passed for bucket: {}. Remaining: {}", bucketKey, probe.getRemainingTokens());
        return joinPoint.proceed();
    }

    private String getBucketKey(RateLimit rateLimit, Method method) {
        // Use custom bucket name if specified
        if (!rateLimit.bucket().isEmpty()) {
            return rateLimit.bucket();
        }

        String baseKey = method.getDeclaringClass().getSimpleName() + "_" + method.getName();

        return switch (rateLimit.scope()) {
            case IP -> "ip_" + getClientIp() + "_" + baseKey;
            case USER -> "user_" + getCurrentUserId() + "_" + baseKey;
            case GLOBAL -> "global_" + baseKey;
        };
    }

    private Bucket getBucket(String key, RateLimit rateLimit) {
        // For simplicity, using IP-based bucket from config
        // In production, create dynamic buckets based on annotation parameters
        return switch (rateLimit.scope()) {
            case IP -> rateLimitConfig.getIpBucket(key);
            case USER -> rateLimitConfig.getUserBucket(key);
            case GLOBAL -> rateLimitConfig.defaultRateLimitBucket();
        };
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                
                // Check for proxy headers
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                
                String xRealIp = request.getHeader("X-Real-IP");
                if (xRealIp != null && !xRealIp.isEmpty()) {
                    return xRealIp;
                }
                
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.error("Failed to get client IP", e);
        }
        return "unknown";
    }

    private String getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                return auth.getName();
            }
        } catch (Exception e) {
            log.error("Failed to get current user ID", e);
        }
        return "anonymous";
    }
}
