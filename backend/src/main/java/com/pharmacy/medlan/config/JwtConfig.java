package com.pharmacy.medlan.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
@Slf4j
public class JwtConfig {

    private String secret;
    private Long expiration = 86400000L; // 24 hours default
    private Long refreshExpiration = 604800000L; // 7 days default
    private String issuer = "medlan-pharmacy";

    @PostConstruct
    public void validate() {
        if (!StringUtils.hasText(secret)) {
            log.warn("JWT secret not configured! Using default (NOT SECURE FOR PRODUCTION)");
            secret = "MedlanPharmacyDefaultSecretKeyPleaseChangeInProduction2024";
        }
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters long");
        }
        if (expiration == null || expiration <= 0) {
            expiration = 86400000L;
            log.warn("Invalid JWT expiration, using default: {} ms", expiration);
        }
        if (refreshExpiration == null || refreshExpiration <= 0) {
            refreshExpiration = 604800000L;
            log.warn("Invalid refresh expiration, using default: {} ms", refreshExpiration);
        }
        log.info("JWT Config initialized - Expiration: {}ms, Refresh: {}ms",
                expiration, refreshExpiration);
    }
}