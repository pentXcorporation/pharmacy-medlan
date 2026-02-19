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

@Configuration
@EnableCaching
public class CacheConfig {

    // Cache Names Constants
    public static final String PRODUCTS = "products";
    public static final String PRODUCTS_BY_CODE = "productsByCode";
    public static final String PRODUCTS_BY_BARCODE = "productsByBarcode";
    public static final String INVENTORY_BATCHES = "inventoryBatches";
    public static final String BRANCHES = "branches";
    public static final String CATEGORIES = "categories";
    public static final String USERS = "users";
    public static final String SYSTEM_CONFIG = "systemConfig";
    public static final String REALTIME_INVENTORY = "realtimeInventory";

    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .recordStats());

        manager.setCacheNames(Arrays.asList(
                PRODUCTS, PRODUCTS_BY_CODE, PRODUCTS_BY_BARCODE,
                "productQRCodes", INVENTORY_BATCHES, "batchQRCodes",
                "lowStockAlerts", "expiryAlerts", BRANCHES,
                CATEGORIES, "subCategories", "units", "suppliers",
                USERS, "userRoles", "invoiceQRCodes", "dailySummaries",
                SYSTEM_CONFIG, "taxCategories"
        ));

        return manager;
    }

    @Bean
    public CacheManager shortLivedCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(
                REALTIME_INVENTORY, "activeSessions", "pendingTransactions");
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .recordStats());
        return manager;
    }

    @Bean
    public CacheManager longLivedCacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(
                "staticConfig", "drugSchedules", "dosageForms", "taxRates");
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(200)
                .expireAfterWrite(2, TimeUnit.HOURS)
                .recordStats());
        return manager;
    }
}