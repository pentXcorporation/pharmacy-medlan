package com.pharmacy.medlan.validation.annotation;

import java.lang.annotation.*;

/**
 * Annotation for rate limiting API endpoints.
 * 
 * Usage:
 * @RateLimit(requests = 10, duration = 60) // 10 requests per 60 seconds
 * @RateLimit(key = "report", capacity = 10, refillTokens = 10, refillSeconds = 60)
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {
    
    /**
     * Maximum number of requests allowed (legacy)
     */
    int requests() default 100;
    
    /**
     * Time window in seconds (legacy)
     */
    int duration() default 60;
    
    /**
     * Rate limit scope
     */
    Scope scope() default Scope.IP;
    
    /**
     * Custom bucket name (for shared limits across endpoints)
     */
    String bucket() default "";
    
    /**
     * Key for the rate limit bucket (new Bucket4j style)
     */
    String key() default "default";
    
    /**
     * Maximum capacity of tokens in the bucket
     */
    int capacity() default 100;
    
    /**
     * Number of tokens to add on refill
     */
    int refillTokens() default 100;
    
    /**
     * Refill interval in seconds
     */
    int refillSeconds() default 60;
    
    enum Scope {
        /**
         * Rate limit per IP address
         */
        IP,
        
        /**
         * Rate limit per authenticated user
         */
        USER,
        
        /**
         * Global rate limit for the endpoint
         */
        GLOBAL
    }
}
