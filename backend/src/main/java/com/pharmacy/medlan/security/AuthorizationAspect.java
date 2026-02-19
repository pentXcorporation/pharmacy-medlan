package com.pharmacy.medlan.security;

import com.pharmacy.medlan.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * AOP Aspect for additional method-level authorization enforcement.
 * Complements @PreAuthorize by providing programmatic authorization checks
 * and audit logging for sensitive operations.
 */
@Aspect
@Component
@Slf4j
public class AuthorizationAspect {

    /**
     * Intercept methods annotated with @PreAuthorize to log access attempts
     */
    @Around("@annotation(org.springframework.security.access.prepost.PreAuthorize)")
    public Object logAuthorizationCheck(ProceedingJoinPoint joinPoint) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";
        String methodName = joinPoint.getSignature().toShortString();

        log.debug("Authorization check: user='{}' accessing method='{}'", username, methodName);

        try {
            Object result = joinPoint.proceed();
            log.debug("Authorization granted: user='{}' for method='{}'", username, methodName);
            return result;
        } catch (org.springframework.security.access.AccessDeniedException e) {
            log.warn("Authorization denied: user='{}' for method='{}'", username, methodName);
            throw e;
        }
    }

    /**
     * Get current user's roles
     */
    public Set<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return Set.of();

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(String role) {
        return getCurrentUserRoles().contains("ROLE_" + role);
    }

    /**
     * Check if current user has any of the specified roles
     */
    public boolean hasAnyRole(String... roles) {
        Set<String> userRoles = getCurrentUserRoles();
        for (String role : roles) {
            if (userRoles.contains("ROLE_" + role)) return true;
        }
        return false;
    }

    /**
     * Require that the current user has a specific role, throw otherwise
     */
    public void requireRole(String role) {
        if (!hasRole(role)) {
            throw new UnauthorizedException("Insufficient permissions. Required role: " + role);
        }
    }
}