package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.notification.NotificationRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Scheduler for monitoring and alerting about low stock levels
 * Runs daily at 7 AM as configured in application.properties
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class LowStockAlertScheduler {

    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final BranchRepository branchRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Daily low stock check - runs at 7 AM
     * Checks stock levels for all products in all branches
     * Creates alerts when stock falls below reorder level or minimum stock
     */
    @Scheduled(cron = "${scheduler.low-stock.cron:0 0 7 * * ?}")
    @Transactional
    public void checkLowStockLevels() {
        log.info("=== Starting Low Stock Alert Check ===");
        
        List<Branch> branches = branchRepository.findAll();
        List<Product> allProducts = productRepository.findByIsActiveTrue();
        
        int criticalCount = 0;
        int lowStockCount = 0;
        int outOfStockCount = 0;
        
        for (Branch branch : branches) {
            log.info("Checking stock levels for branch: {}", branch.getBranchName());
            
            for (Product product : allProducts) {
                // Calculate total available quantity for this product in this branch
                Integer totalQuantity = inventoryBatchRepository
                        .sumAvailableQuantityByProductAndBranch(product.getId(), branch.getId());
                
                if (totalQuantity == null) {
                    totalQuantity = 0;
                }
                
                AlertLevel alertLevel = null;
                String alertMessage = null;
                
                // OUT OF STOCK - No inventory at all
                if (totalQuantity == 0) {
                    alertLevel = AlertLevel.CRITICAL;
                    alertMessage = String.format(
                            "OUT OF STOCK: %s (Code: %s) - No stock available in %s. Order immediately!",
                            product.getProductName(),
                            product.getProductCode(),
                            branch.getBranchName()
                    );
                    outOfStockCount++;
                }
                // CRITICAL STOCK - Below minimum stock level
                else if (totalQuantity <= product.getMinimumStock()) {
                    alertLevel = AlertLevel.CRITICAL;
                    alertMessage = String.format(
                            "CRITICAL STOCK: %s (Code: %s) - Only %d units left in %s. Minimum required: %d. Order urgently!",
                            product.getProductName(),
                            product.getProductCode(),
                            totalQuantity,
                            branch.getBranchName(),
                            product.getMinimumStock()
                    );
                    criticalCount++;
                }
                // LOW STOCK - Below reorder level
                else if (totalQuantity <= product.getReorderLevel()) {
                    alertLevel = AlertLevel.URGENT;
                    alertMessage = String.format(
                            "LOW STOCK: %s (Code: %s) - %d units left in %s. Reorder level: %d. Please reorder soon.",
                            product.getProductName(),
                            product.getProductCode(),
                            totalQuantity,
                            branch.getBranchName(),
                            product.getReorderLevel()
                    );
                    lowStockCount++;
                }
                
                // Create notification if stock is low
                if (alertLevel != null) {
                    createLowStockNotification(branch, product, alertLevel, alertMessage, totalQuantity);
                }
            }
        }
        
        log.info("Low Stock Alert Summary - Out of Stock: {}, Critical: {}, Low Stock: {}",
                outOfStockCount, criticalCount, lowStockCount);
        log.info("=== Low Stock Alert Check Complete ===");
    }

    /**
     * Generate auto-reorder suggestions for products below reorder level
     * Suggests optimal order quantity based on:
     * - Current stock
     * - Maximum stock capacity
     * - Average consumption (if available)
     */
    @Scheduled(cron = "0 0 8 * * ?") // Daily at 8 AM
    @Transactional
    public void generateReorderSuggestions() {
        log.info("=== Generating Auto-Reorder Suggestions ===");
        
        List<Branch> branches = branchRepository.findAll();
        
        for (Branch branch : branches) {
            Map<Product, Integer> reorderSuggestions = new HashMap<>();
            
            List<Product> lowStockProducts = productRepository.findByIsActiveTrue();
            
            for (Product product : lowStockProducts) {
                Integer currentStock = inventoryBatchRepository
                        .sumAvailableQuantityByProductAndBranch(product.getId(), branch.getId());
                
                if (currentStock == null) {
                    currentStock = 0;
                }
                
                // If stock is at or below reorder level, suggest order
                if (currentStock <= product.getReorderLevel()) {
                    // Calculate suggested order quantity
                    // Formula: (Maximum Stock - Current Stock) + Safety Buffer (20% of max)
                    int suggestedQuantity = (product.getMaximumStock() - currentStock) + 
                            (int) (product.getMaximumStock() * 0.2);
                    
                    reorderSuggestions.put(product, suggestedQuantity);
                }
            }
            
            // Create consolidated reorder notification
            if (!reorderSuggestions.isEmpty()) {
                createReorderSuggestionNotification(branch, reorderSuggestions);
            }
        }
        
        log.info("=== Auto-Reorder Suggestions Generated ===");
    }

    private void createLowStockNotification(Branch branch, Product product, 
                                           AlertLevel alertLevel, String message, int currentStock) {
        // Get procurement managers, inventory managers, and branch managers
        List<User> recipientUsers = userRepository
                .findByBranchIdAndRoleIn(
                        branch.getId(),
                        List.of("ADMIN", "BRANCH_MANAGER", "INVENTORY_MANAGER")
                );
        
        for (User user : recipientUsers) {
            Notification notification = Notification.builder()
                    .user(user)
                    .type(NotificationType.LOW_STOCK_ALERT)
                    .title("Low Stock Alert")
                    .message(message)
                    .priority(alertLevel.name())
                    .referenceType("PRODUCT")
                    .referenceId(product.getId())
                    .isRead(false)
                    .build();
            
            notificationRepository.save(notification);
        }
    }

    private void createReorderSuggestionNotification(Branch branch, 
                                                     Map<Product, Integer> suggestions) {
        StringBuilder message = new StringBuilder();
        message.append(String.format("Auto-Reorder Suggestions for %s:\n\n", branch.getBranchName()));
        
        suggestions.forEach((product, quantity) -> {
            message.append(String.format("• %s (Code: %s) - Order %d units\n",
                    product.getProductName(),
                    product.getProductCode(),
                    quantity));
        });
        
        message.append("\nPlease review and create purchase orders accordingly.");
        
        List<User> recipientUsers = userRepository
                .findByBranchIdAndRoleIn(
                        branch.getId(),
                        List.of("ADMIN", "BRANCH_MANAGER", "INVENTORY_MANAGER")
                );
        
        for (User user : recipientUsers) {
            Notification notification = Notification.builder()
                    .user(user)
                    .type(NotificationType.REORDER_SUGGESTION)
                    .title("Auto-Reorder Suggestions")
                    .message(message.toString())
                    .priority(AlertLevel.WARNING.name())
                    .referenceType("BRANCH")
                    .referenceId(branch.getId())
                    .isRead(false)
                    .build();
            
            notificationRepository.save(notification);
        }
    }
}
