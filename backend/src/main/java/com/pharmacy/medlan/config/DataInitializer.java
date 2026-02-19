package com.pharmacy.medlan.config;

import com.pharmacy.medlan.enums.Role;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Bean
    public ApplicationRunner initializeData() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("No users found. Creating default users...");
                createDefaultUsers();
            } else {
                log.info("Users already exist. Database is initialized.");

                // Only reset in dev profile
                if (isDevelopmentMode()) {
                    log.warn("DEV MODE: Resetting superadmin password to default");
                    resetSuperAdminPassword();
                }
            }
        };
    }

    private boolean isDevelopmentMode() {
        String[] activeProfiles = environment.getActiveProfiles();
        return activeProfiles.length == 0 ||
                java.util.Arrays.asList(activeProfiles).contains("dev");
    }

    private void resetSuperAdminPassword() {
        userRepository.findByUsername("superadmin").ifPresent(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(user);
            log.info("Superadmin password reset to: admin123");
        });
    }

    private void createDefaultUsers() {
        createUser("superadmin", "admin123", "Super Administrator",
                "admin@medlan.com", "0771234567", Role.SUPER_ADMIN, "EMP001");
        createUser("admin", "admin123", "Administrator",
                "administrator@medlan.com", "0772345678", Role.ADMIN, "EMP002");
        createUser("branchmanager", "branch123", "Branch Manager",
                "branch@medlan.com", "0773456789", Role.BRANCH_MANAGER, "EMP003");
        createUser("pharmacist", "pharm123", "Pharmacist User",
                "pharmacist@medlan.com", "0774567890", Role.PHARMACIST, "EMP004");
        createUser("cashier", "cash123", "Cashier User",
                "cashier@medlan.com", "0775678901", Role.CASHIER, "EMP005");
        createUser("inventory", "inv123", "Inventory Manager",
                "inventory@medlan.com", "0776789012", Role.INVENTORY_MANAGER, "EMP006");
        createUser("accountant", "acc123", "Accountant User",
                "accountant@medlan.com", "0777890123", Role.ACCOUNTANT, "EMP007");

        log.info("===========================================");
        log.info("Default users created successfully!");
        log.info("===========================================");
    }

    private void createUser(String username, String password, String fullName,
                            String email, String phone, Role role, String empCode) {
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .email(email)
                .phoneNumber(phone)
                .role(role)
                .employeeCode(empCode)
                .isActive(true)
                .build();
        userRepository.save(user);
        log.info("Created user: {} / {} ({})", username, password, role);
    }
}