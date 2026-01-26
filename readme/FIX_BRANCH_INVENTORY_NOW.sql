-- ============================================================
-- FIX BRANCH_INVENTORY FROM INVENTORY_BATCHES
-- ============================================================
-- Aggregates inventory_batches into branch_inventory table
-- ============================================================

DELETE FROM branch_inventory;

INSERT INTO branch_inventory (
    product_id,
    branch_id,
    quantity_on_hand,
    quantity_available,
    quantity_allocated,
    reorder_level,
    minimum_stock,
    maximum_stock,
    created_date,
    updated_date
)
SELECT 
    ib.product_id,
    ib.branch_id,
    COALESCE(SUM(ib.quantity_available), 0) as quantity_on_hand,
    COALESCE(SUM(ib.quantity_available), 0) as quantity_available,
    0 as quantity_allocated,
    COALESCE(MAX(p.reorder_level), 10) as reorder_level,
    COALESCE(MAX(p.minimum_stock), 5) as minimum_stock,
    COALESCE(MAX(p.maximum_stock), 100) as maximum_stock,
    CURRENT_TIMESTAMP as created_date,
    CURRENT_TIMESTAMP as updated_date
FROM inventory_batches ib
LEFT JOIN products p ON p.id = ib.product_id
WHERE ib.quantity_available > 0
GROUP BY ib.product_id, ib.branch_id;
