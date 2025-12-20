package com.pharmacy.medlan.security;

import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SecurityUtils {

    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String principal = authentication.getName();
        return Optional.ofNullable(principal);
    }

    /**
     * Get the current authenticated user entity.
     *
     * @param userRepository the user repository to use
     * @return the current user entity or null if not found
     */
    public static User getCurrentUser(UserRepository userRepository) {
        return getCurrentUserLogin()
                .flatMap(userRepository::findByUsername)
                .orElse(null);
    }

    /**
     * Check if the current user is authenticated.
     *
     * @return true if authenticated, false otherwise
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}
