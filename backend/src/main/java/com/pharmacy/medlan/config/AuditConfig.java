package com.pharmacy.medlan.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@Slf4j
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated()
                        || "anonymousUser".equals(authentication.getPrincipal())) {
                    log.debug("No authenticated user found, using SYSTEM as auditor");
                    return Optional.of("SYSTEM");
                }
                String username = authentication.getName();
                log.debug("Auditor resolved to: {}", username);
                return Optional.of(username != null ? username : "SYSTEM");
            } catch (Exception e) {
                log.warn("Error resolving auditor, defaulting to SYSTEM: {}", e.getMessage());
                return Optional.of("SYSTEM");
            }
        };
    }
}