package com.pharmacy.medlan.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration using Bucket4j.
 * Protects APIs from abuse and ensures fair usage.
 */
@Configuration
public class RateLimitConfig {

    /**
     * Storage for per-user rate limit buckets
     */
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();
    
    /**
     * Storage for per-IP rate limit buckets
     */
    private final Map<String, Bucket> ipBuckets = new ConcurrentHashMap<>();

    /**
     * Default rate limit: 100 requests per minute
     */
    @Bean
    public Bucket defaultRateLimitBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
                .build();
    }

    /**
     * Strict rate limit for login attempts: 5 per minute
     */
    @Bean
    public Bucket loginRateLimitBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
                .addLimit(Bandwidth.classic(20, Refill.greedy(20, Duration.ofHours(1))))
                .build();
    }

    /**
     * Rate limit for report generation: 10 per minute
     */
    @Bean
    public Bucket reportRateLimitBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
                .build();
    }

    /**
     * Rate limit for barcode generation: 50 per minute
     */
    @Bean
    public Bucket barcodeRateLimitBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1))))
                .build();
    }

    /**
     * Rate limit for bulk operations: 5 per minute
     */
    @Bean
    public Bucket bulkOperationRateLimitBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
                .build();
    }

    /**
     * Get or create a rate limit bucket for a specific user
     */
    public Bucket getUserBucket(String userId) {
        return userBuckets.computeIfAbsent(userId, key -> 
                Bucket.builder()
                        .addLimit(Bandwidth.classic(200, Refill.greedy(200, Duration.ofMinutes(1))))
                        .build()
        );
    }

    /**
     * Get or create a rate limit bucket for a specific IP
     */
    public Bucket getIpBucket(String ipAddress) {
        return ipBuckets.computeIfAbsent(ipAddress, key -> 
                Bucket.builder()
                        .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
                        .addLimit(Bandwidth.classic(1000, Refill.greedy(1000, Duration.ofHours(1))))
                        .build()
        );
    }

    /**
     * Get rate limit bucket for login attempts by IP
     */
    public Bucket getLoginBucket(String ipAddress) {
        return ipBuckets.computeIfAbsent("login_" + ipAddress, key -> 
                Bucket.builder()
                        .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
                        .addLimit(Bandwidth.classic(20, Refill.greedy(20, Duration.ofHours(1))))
                        .build()
        );
    }

    /**
     * Clean up expired buckets (call periodically)
     */
    public void cleanupBuckets() {
        // In a production system, implement bucket expiration logic
        // For now, keep all buckets
    }
}
