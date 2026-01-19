-- ============================================================
-- POPULATE BRANCH_INVENTORY FROM EXISTING INVENTORY_BATCHES
-- ============================================================
-- This script aggregates data from inventory_batches table
-- and populates the branch_inventory table with current stock levels
-- Run this ONCE to fix the empty branch_inventory table
-- ============================================================

-- Step 1: Check current state
SELECT 'Current inventory_batches count:' as info, COUNT(*) as count FROM inventory_batches;
SELECT 'Current branch_inventory count:' as info, COUNT(*) as count FROM branch_inventory;

-- Step 2: Clear existing branch_inventory data (if any)
-- TRUNCATE TABLE branch_inventory;

-- Step 3: Populate branch_inventory from inventory_batches
INSERT INTO branch_inventory (
    product_id, 
    branch_id, 
    quantity_on_hand, 
    quantity_available, 
    quantity_allocated, 
    reorder_level, 
    minimum_stock, 
    last_restock_date, 
    created_date, 
    updated_date
)
SELECT 
    ib.product_id,
    ib.branch_id,
    SUM(ib.quantity_available)::INTEGER as quantity_on_hand,
    SUM(ib.quantity_available)::INTEGER as quantity_available,
    0 as quantity_allocated,
    COALESCE(p.reorder_point, 10) as reorder_level,
    COALESCE(p.minimum_stock, 5) as minimum_stock,
    MAX(ib.created_date) as last_restock_date,
    CURRENT_TIMESTAMP as created_date,
    CURRENT_TIMESTAMP as updated_date
FROM inventory_batches ib
LEFT JOIN products p ON p.product_id = ib.product_id
WHERE ib.quantity_available > 0  -- Only include batches with available stock
GROUP BY ib.product_id, ib.branch_id, p.reorder_point, p.minimum_stock
ON CONFLICT (product_id, branch_id) 
DO UPDATE SET
    quantity_on_hand = EXCLUDED.quantity_on_hand,
    quantity_available = EXCLUDED.quantity_available,
    last_restock_date = EXCLUDED.last_restock_date,
    updated_date = CURRENT_TIMESTAMP;

-- Step 4: Verify the results
SELECT 'New branch_inventory count:' as info, COUNT(*) as count FROM branch_inventory;

-- Step 5: View sample data
SELECT 
    bi.id,
    p.product_name,
    b.branch_name,
    bi.quantity_on_hand,
    bi.quantity_available,
    bi.quantity_allocated,
    bi.last_restock_date
FROM branch_inventory bi
JOIN products p ON p.product_id = bi.product_id
JOIN branches b ON b.branch_id = bi.branch_id
ORDER BY bi.created_date DESC
LIMIT 20;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Compare totals between inventory_batches and branch_inventory
SELECT 
    'inventory_batches total quantity:' as source,
    SUM(quantity_available) as total_quantity
FROM inventory_batches
UNION ALL
SELECT 
    'branch_inventory total quantity:' as source,
    SUM(quantity_on_hand) as total_quantity
FROM branch_inventory;

-- Check if any products are missing from branch_inventory
SELECT DISTINCT
    ib.product_id,
    p.product_name,
    ib.branch_id,
    b.branch_name,
    'Missing in branch_inventory' as status
FROM inventory_batches ib
JOIN products p ON p.product_id = ib.product_id
JOIN branches b ON b.branch_id = ib.branch_id
LEFT JOIN branch_inventory bi ON bi.product_id = ib.product_id AND bi.branch_id = ib.branch_id
WHERE bi.id IS NULL
AND ib.quantity_available > 0;
