package com.pharmacy.medlan.config;

import com.pharmacy.medlan.enums.Role;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Data Initializer - Seeds default users for development/testing
 * Creates default admin user if no users exist in database
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner initializeData() {
        return args -> {
            // Only seed data if no users exist
            if (userRepository.count() == 0) {
                log.info("No users found. Creating default users...");
                createDefaultUsers();
            } else {
                log.info("Users already exist. Resetting superadmin password for development...");
                resetSuperAdminPassword();
            }
        };
    }

    private void resetSuperAdminPassword() {
        userRepository.findByUsername("superadmin").ifPresent(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(user);
            log.info("Reset superadmin password to: admin123");
        });
    }

    private void createDefaultUsers() {
        // Create Super Admin
        User superAdmin = User.builder()
                .username("superadmin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Super Administrator")
                .email("admin@medlan.com")
                .phoneNumber("0771234567")
                .role(Role.SUPER_ADMIN)
                .employeeCode("EMP001")
                .isActive(true)
                .build();
        userRepository.save(superAdmin);
        log.info("Created Super Admin user: superadmin / admin123");

        // Create Admin
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Administrator")
                .email("administrator@medlan.com")
                .phoneNumber("0772345678")
                .role(Role.ADMIN)
                .employeeCode("EMP002")
                .isActive(true)
                .build();
        userRepository.save(admin);
        log.info("Created Admin user: admin / admin123");

        // Create Branch Manager
        User branchManager = User.builder()
                .username("branchmanager")
                .password(passwordEncoder.encode("branch123"))
                .fullName("Branch Manager")
                .email("branch@medlan.com")
                .phoneNumber("0773456789")
                .role(Role.BRANCH_MANAGER)
                .employeeCode("EMP003")
                .isActive(true)
                .build();
        userRepository.save(branchManager);
        log.info("Created Branch Manager user: branchmanager / branch123");

        // Create Pharmacist
        User pharmacist = User.builder()
                .username("pharmacist")
                .password(passwordEncoder.encode("pharm123"))
                .fullName("Pharmacist User")
                .email("pharmacist@medlan.com")
                .phoneNumber("0774567890")
                .role(Role.PHARMACIST)
                .employeeCode("EMP004")
                .isActive(true)
                .build();
        userRepository.save(pharmacist);
        log.info("Created Pharmacist user: pharmacist / pharm123");

        // Create Cashier
        User cashier = User.builder()
                .username("cashier")
                .password(passwordEncoder.encode("cash123"))
                .fullName("Cashier User")
                .email("cashier@medlan.com")
                .phoneNumber("0775678901")
                .role(Role.CASHIER)
                .employeeCode("EMP005")
                .isActive(true)
                .build();
        userRepository.save(cashier);
        log.info("Created Cashier user: cashier / cash123");

        // Create Inventory Manager
        User inventoryManager = User.builder()
                .username("inventory")
                .password(passwordEncoder.encode("inv123"))
                .fullName("Inventory Manager")
                .email("inventory@medlan.com")
                .phoneNumber("0776789012")
                .role(Role.INVENTORY_MANAGER)
                .employeeCode("EMP006")
                .isActive(true)
                .build();
        userRepository.save(inventoryManager);
        log.info("Created Inventory Manager user: inventory / inv123");

        // Create Accountant
        User accountant = User.builder()
                .username("accountant")
                .password(passwordEncoder.encode("acc123"))
                .fullName("Accountant User")
                .email("accountant@medlan.com")
                .phoneNumber("0777890123")
                .role(Role.ACCOUNTANT)
                .employeeCode("EMP007")
                .isActive(true)
                .build();
        userRepository.save(accountant);
        log.info("Created Accountant user: accountant / acc123");

        log.info("===========================================");
        log.info("Default users created successfully!");
        log.info("===========================================");
        log.info("Login Credentials:");
        log.info("  Super Admin:     superadmin / admin123");
        log.info("  Admin:           admin / admin123");
        log.info("  Branch Manager:  branchmanager / branch123");
        log.info("  Pharmacist:      pharmacist / pharm123");
        log.info("  Cashier:         cashier / cash123");
        log.info("  Inventory:       inventory / inv123");
        log.info("  Accountant:      accountant / acc123");
        log.info("===========================================");
    }
}
