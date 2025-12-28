package com.pharmacy.medlan.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * Cache configuration using Caffeine for high-performance caching.
 * 
 * Cache Strategies:
 * - Short-lived: Session data, real-time inventory
 * - Medium-lived: Product catalogs, categories
 * - Long-lived: System configuration, static data
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Default cache manager with moderate expiration
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .recordStats());
        
        // Register all cache names
        cacheManager.setCacheNames(Arrays.asList(
                // Product caches
                "products",
                "productsByCode",
                "productsByBarcode",
                "productQRCodes",
                
                // Inventory caches
                "inventoryBatches",
                "batchQRCodes",
                "lowStockAlerts",
                "expiryAlerts",
                
                // Organization caches
                "branches",
                "categories",
                "subCategories",
                "units",
                "suppliers",
                
                // User caches
                "users",
                "userRoles",
                
                // Finance caches
                "invoiceQRCodes",
                "dailySummaries",
                
                // System caches
                "systemConfig",
                "taxCategories"
        ));
        
        return cacheManager;
    }

    /**
     * Short-lived cache for real-time data (5 minutes)
     */
    @Bean
    public CacheManager shortLivedCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "realtimeInventory",
                "activeSessions",
                "pendingTransactions"
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .recordStats());
        return cacheManager;
    }

    /**
     * Long-lived cache for static/rarely changing data (2 hours)
     */
    @Bean
    public CacheManager longLivedCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "staticConfig",
                "drugSchedules",
                "dosageForms",
                "taxRates"
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(200)
                .expireAfterWrite(2, TimeUnit.HOURS)
                .recordStats());
        return cacheManager;
    }

    /**
     * Barcode/QR code cache (1 hour)
     */
    @Bean
    public CacheManager barcodeCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "barcodeImages",
                "qrCodeImages",
                "shelfLabels"
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(1, TimeUnit.HOURS)
                .recordStats());
        return cacheManager;
    }
}
