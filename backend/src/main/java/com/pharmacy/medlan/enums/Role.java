package com.pharmacy.medlan.enums;

public enum Role {
    SUPER_ADMIN("Super Administrator", "Full system access"),
    ADMIN("Administrator", "Branch-level admin access"),
    OWNER("Owner", "Business owner access"),
    BRANCH_MANAGER("Branch Manager", "Manage branch operations"),
    MANAGER("Manager", "Manage operations"),
    PHARMACIST("Pharmacist", "Dispense medicines and sales"),
    CASHIER("Cashier", "Sales and billing"),
    INVENTORY_MANAGER("Inventory Manager", "Manage stock and inventory"),
    ACCOUNTANT("Accountant", "Financial operations");

    private final String displayName;
    private final String description;

    Role(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
}