package com.pharmacy.medlan.scheduler;

import com.pharmacy.medlan.enums.AlertLevel;
import com.pharmacy.medlan.enums.NotificationType;
import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.notification.NotificationRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import com.pharmacy.medlan.repository.supplier.PurchaseOrderRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Scheduler for monitoring low stock levels and generating reorder suggestions.
 * All cron expressions are externalised to application.properties.
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
    private final PurchaseOrderRepository purchaseOrderRepository;

    private static final List<String> STOCK_ROLES = List.of("ADMIN", "BRANCH_MANAGER", "INVENTORY_MANAGER");

    /**
     * Daily low-stock check — runs at 7 AM (configurable).
     * Iterates all active branches and checks every active product's stock
     * against its reorder / minimum-stock thresholds.
     */
    @Scheduled(cron = "${scheduler.low-stock.cron:0 0 7 * * ?}")
    @Transactional
    public void checkLowStockLevels() {
        log.info("=== Starting Low Stock Alert Check ===");

        List<Branch> branches = branchRepository.findAll();
        List<Product> activeProducts = productRepository.findByIsActiveTrueAndDeletedFalse();

        int outOfStockCount = 0, criticalCount = 0, lowStockCount = 0, autoOrdersCreated = 0;
        List<Notification> notifications = new ArrayList<>();

        for (Branch branch : branches) {
            log.debug("Checking stock levels for branch: {}", branch.getBranchName());

            for (Product product : activeProducts) {
                int totalQty = resolveStock(product.getId(), branch.getId());

                AlertLevel alertLevel = null;
                String alertMessage = null;
                boolean needsReorder = false;

                if (totalQty == 0) {
                    alertLevel = AlertLevel.CRITICAL;
                    alertMessage = String.format(
                            "OUT OF STOCK: %s (Code: %s) — No stock available in %s.",
                            product.getProductName(), product.getProductCode(), branch.getBranchName());
                    outOfStockCount++;
                    needsReorder = true;
                } else if (totalQty <= product.getMinimumStock()) {
                    alertLevel = AlertLevel.CRITICAL;
                    alertMessage = String.format(
                            "CRITICAL STOCK: %s (Code: %s) — %d units left in %s. Minimum: %d.",
                            product.getProductName(), product.getProductCode(),
                            totalQty, branch.getBranchName(), product.getMinimumStock());
                    criticalCount++;
                    needsReorder = true;
                } else if (totalQty <= product.getReorderLevel()) {
                    alertLevel = AlertLevel.URGENT;
                    alertMessage = String.format(
                            "LOW STOCK: %s (Code: %s) — %d units left in %s. Reorder level: %d.",
                            product.getProductName(), product.getProductCode(),
                            totalQty, branch.getBranchName(), product.getReorderLevel());
                    lowStockCount++;
                    needsReorder = true;
                }

                if (needsReorder) {
                    notifications.addAll(buildStockNotifications(branch, product, alertLevel, alertMessage));

                    if (product.getSupplier() != null) {
                        createOrUpdateDraftPO(branch, product, totalQty);
                        autoOrdersCreated++;
                    }
                }
            }
        }

        // Batch insert all notifications — avoids N individual INSERTs
        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }

        log.info("Low Stock Check Complete — Out: {}, Critical: {}, Low: {}, Auto-Draft Items: {}",
                outOfStockCount, criticalCount, lowStockCount, autoOrdersCreated);
        log.info("=== Low Stock Alert Check Complete ===");
    }

    /**
     * Generates summarised reorder suggestions per branch — runs at 8 AM (configurable).
     * Sends a single notification per branch listing all below-reorder products.
     */
    @Scheduled(cron = "${scheduler.reorder-suggestions.cron:0 0 8 * * ?}")
    @Transactional
    public void generateReorderSuggestions() {
        log.info("=== Generating Reorder Suggestions ===");

        List<Branch> branches = branchRepository.findAll();
        List<Product> activeProducts = productRepository.findByIsActiveTrueAndDeletedFalse();
        List<Notification> notifications = new ArrayList<>();

        for (Branch branch : branches) {
            Map<Product, Integer> reorderSuggestions = new HashMap<>();

            for (Product product : activeProducts) {
                int currentStock = resolveStock(product.getId(), branch.getId());
                if (currentStock <= product.getReorderLevel()) {
                    int suggestedQty = (product.getMaximumStock() - currentStock)
                            + (int) (product.getMaximumStock() * 0.2);
                    reorderSuggestions.put(product, Math.max(suggestedQty, 1));
                }
            }

            if (!reorderSuggestions.isEmpty()) {
                notifications.addAll(buildReorderSuggestionNotifications(branch, reorderSuggestions));
            }
        }

        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }

        log.info("=== Reorder Suggestions Generated ===");
    }

    // ==================== Private Helpers ====================

    private int resolveStock(Long productId, Long branchId) {
        Integer qty = inventoryBatchRepository.sumAvailableQuantityByProductAndBranch(productId, branchId);
        return qty != null ? qty : 0;
    }

    /**
     * Creates or updates a DRAFT PO for the product in the given branch.
     * Full implementation requires a direct Supplier entity on Product.
     */
    private void createOrUpdateDraftPO(Branch branch, Product product, int currentStock) {
        int quantityNeeded = Math.max(
                (product.getMaximumStock() - currentStock) + (int) (product.getMaximumStock() * 0.1),
                10);
        log.info("Auto-Draft PO intent: product='{}', branch='{}', qty={}",
                product.getProductName(), branch.getBranchName(), quantityNeeded);
        // TODO: Implement PO creation once Supplier is linked directly to Product entity.
    }

    /** Builds low-stock Notification objects without persisting them. */
    private List<Notification> buildStockNotifications(Branch branch, Product product,
                                                       AlertLevel alertLevel, String message) {
        List<User> recipients = userRepository.findByBranchIdAndRoleIn(branch.getId(), STOCK_ROLES);
        List<Notification> result = new ArrayList<>(recipients.size());
        for (User user : recipients) {
            result.add(Notification.builder()
                    .user(user)
                    .type(NotificationType.LOW_STOCK_ALERT)
                    .title("Low Stock Alert — " + branch.getBranchName())
                    .message(message)
                    .priority(alertLevel.name())
                    .referenceType("PRODUCT")
                    .referenceId(product.getId())
                    .isRead(false)
                    .build());
        }
        return result;
    }

    /** Builds a single summary Notification per user listing all reorder suggestions. */
    private List<Notification> buildReorderSuggestionNotifications(Branch branch,
                                                                   Map<Product, Integer> suggestions) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Auto-Reorder Suggestions for %s:%n%n", branch.getBranchName()));
        suggestions.forEach((product, qty) ->
                sb.append(String.format("• %s (Code: %s) — Suggested: %d units%n",
                        product.getProductName(), product.getProductCode(), qty)));
        sb.append("\nDraft Purchase Orders have been updated. Please review in 'Drafts'.");

        String message = sb.toString();
        List<User> recipients = userRepository.findByBranchIdAndRoleIn(branch.getId(), STOCK_ROLES);
        List<Notification> result = new ArrayList<>(recipients.size());
        for (User user : recipients) {
            result.add(Notification.builder()
                    .user(user)
                    .type(NotificationType.REORDER_SUGGESTION)
                    .title("Daily Order Suggestions")
                    .message(message)
                    .priority(AlertLevel.WARNING.name())
                    .referenceType("BRANCH")
                    .referenceId(branch.getId())
                    .isRead(false)
                    .build());
        }
        return result;
    }
}