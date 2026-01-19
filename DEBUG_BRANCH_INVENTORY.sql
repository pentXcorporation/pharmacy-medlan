-- ============================================================
-- DIAGNOSTIC QUERIES TO DEBUG AVAILABLE STOCK EMPTY ISSUE
-- ============================================================
-- Run these queries to understand why the Available Stock page is empty
-- ============================================================

-- 1. Check what's in branch_inventory table
SELECT 
    bi.id,
    bi.product_id,
    p.product_code,
    p.product_name,
    bi.branch_id,
    b.branch_name,
    bi.quantity_on_hand,
    bi.quantity_available,
    bi.quantity_allocated,
    bi.reorder_level,
    bi.minimum_stock
FROM branch_inventory bi
LEFT JOIN products p ON p.product_id = bi.product_id
LEFT JOIN branches b ON b.branch_id = bi.branch_id;

-- 2. Check if products and branches exist
SELECT 'Products count:' as info, COUNT(*) as count FROM products
UNION ALL
SELECT 'Branches count:' as info, COUNT(*) as count FROM branches
UNION ALL
SELECT 'Branch Inventory count:' as info, COUNT(*) as count FROM branch_inventory
UNION ALL
SELECT 'Inventory Batches count:' as info, COUNT(*) as count FROM inventory_batches;

-- 3. Check if the branch_id in branch_inventory matches existing branches
SELECT 
    bi.branch_id,
    'Exists in branches' as status,
    b.branch_name
FROM branch_inventory bi
LEFT JOIN branches b ON b.branch_id = bi.branch_id;

-- 4. Check if there are orphaned records (product or branch doesn't exist)
SELECT 
    bi.id,
    bi.product_id,
    CASE WHEN p.product_id IS NULL THEN 'MISSING PRODUCT' ELSE 'OK' END as product_status,
    bi.branch_id,
    CASE WHEN b.branch_id IS NULL THEN 'MISSING BRANCH' ELSE 'OK' END as branch_status
FROM branch_inventory bi
LEFT JOIN products p ON p.product_id = bi.product_id
LEFT JOIN branches b ON b.branch_id = bi.branch_id
WHERE p.product_id IS NULL OR b.branch_id IS NULL;

-- 5. Show what inventory_batches exist
SELECT 
    ib.id,
    ib.product_id,
    p.product_code,
    p.product_name,
    ib.branch_id,
    b.branch_name,
    ib.batch_number,
    ib.quantity_received,
    ib.quantity_available,
    ib.expiry_date
FROM inventory_batches ib
LEFT JOIN products p ON p.product_id = ib.product_id
LEFT JOIN branches b ON b.branch_id = ib.branch_id
ORDER BY ib.created_date DESC
LIMIT 10;

-- 6. Check the actual branch IDs to verify what the frontend should be sending
SELECT 
    branch_id,
    branch_name,
    branch_code,
    is_active
FROM branches
ORDER BY branch_id;
