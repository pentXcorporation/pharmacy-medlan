-- =====================================================
-- PHARMACY MANAGEMENT SYSTEM
-- BRANCH ISOLATION MIGRATION SCRIPT
-- Date: February 1, 2026
-- Purpose: Add branch_id foreign key to tables lacking branch isolation
-- =====================================================

-- This script adds branch_id to 13 critical tables that need branch isolation
-- Run this in a transaction to ensure atomicity

BEGIN;

-- =====================================================
-- 1. EMPLOYEE AUTHORIZATIONS
-- =====================================================
-- Employee authorizations should be branch-specific
ALTER TABLE employee_authorizations 
ADD COLUMN branch_id BIGINT;

-- Add foreign key constraint
ALTER TABLE employee_authorizations 
ADD CONSTRAINT fk_employee_authorizations_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

-- Add index for performance
CREATE INDEX idx_employee_authorizations_branch_id ON employee_authorizations(branch_id);

-- Migrate existing data (assign to user's primary branch if available)
UPDATE employee_authorizations ea
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = ea.employee_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- For records without a primary branch, use any active branch
UPDATE employee_authorizations ea
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = ea.employee_id 
    AND bs.is_active = TRUE
    LIMIT 1
)
WHERE branch_id IS NULL;

-- Set NOT NULL after migration
ALTER TABLE employee_authorizations 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 2. SUPPLIER PAYMENTS
-- =====================================================
-- Supplier payments should be tracked per branch
ALTER TABLE supplier_payments 
ADD COLUMN branch_id BIGINT;

ALTER TABLE supplier_payments 
ADD CONSTRAINT fk_supplier_payments_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_supplier_payments_branch_id ON supplier_payments(branch_id);

-- Migrate existing data from related GRNs
UPDATE supplier_payments sp
SET branch_id = (
    SELECT DISTINCT g.branch_id
    FROM supplier_payment_details spd
    JOIN grns g ON spd.grn_id = g.id
    WHERE spd.supplier_payment_id = sp.id
    LIMIT 1
);

-- For payments without GRN link, assign to main branch
UPDATE supplier_payments
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE supplier_payments 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 3. PAYMENTS (POS)
-- =====================================================
-- POS payments should be branch-specific
ALTER TABLE payments 
ADD COLUMN branch_id BIGINT;

ALTER TABLE payments 
ADD CONSTRAINT fk_payments_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_payments_branch_id ON payments(branch_id);

-- Migrate from invoice or sale
UPDATE payments p
SET branch_id = (
    SELECT i.branch_id 
    FROM invoices i 
    WHERE i.id = p.invoice_id
    LIMIT 1
);

UPDATE payments p
SET branch_id = (
    SELECT s.branch_id 
    FROM sales s 
    WHERE s.id = p.sale_id
    LIMIT 1
)
WHERE branch_id IS NULL;

-- Fallback to main branch
UPDATE payments
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE payments 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 4. GRN_TEMP
-- =====================================================
-- Temporary GRN data should be branch-specific
ALTER TABLE grn_temp 
ADD COLUMN branch_id BIGINT;

ALTER TABLE grn_temp 
ADD CONSTRAINT fk_grn_temp_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;

CREATE INDEX idx_grn_temp_branch_id ON grn_temp(branch_id);

-- Migrate from user's current branch
UPDATE grn_temp gt
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = gt.user_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- Fallback to main branch
UPDATE grn_temp
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE grn_temp 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 5. EXPIRY_DATA
-- =====================================================
-- Expiry tracking should be branch-specific
ALTER TABLE expiry_data 
ADD COLUMN branch_id BIGINT;

ALTER TABLE expiry_data 
ADD CONSTRAINT fk_expiry_data_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;

CREATE INDEX idx_expiry_data_branch_id ON expiry_data(branch_id);

-- Migrate from matching inventory batches
UPDATE expiry_data ed
SET branch_id = (
    SELECT ib.branch_id 
    FROM inventory_batches ib 
    WHERE ib.product_id = ed.product_id 
    AND ib.batch_number = ed.batch_price::TEXT
    AND ib.expiry_date = ed.expiry_date
    LIMIT 1
);

-- Fallback to main branch
UPDATE expiry_data
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE expiry_data 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 6. CUSTOMER_DATA
-- =====================================================
-- Customer transaction history should be branch-specific
ALTER TABLE customer_data 
ADD COLUMN branch_id BIGINT;

ALTER TABLE customer_data 
ADD CONSTRAINT fk_customer_data_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_customer_data_branch_id ON customer_data(branch_id);

-- Migrate from invoice
UPDATE customer_data cd
SET branch_id = (
    SELECT i.branch_id 
    FROM invoices i 
    WHERE i.invoice_number = cd.invoice_number
    LIMIT 1
);

-- Fallback to user's branch
UPDATE customer_data cd
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = cd.user_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
)
WHERE branch_id IS NULL;

-- Fallback to main branch
UPDATE customer_data
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE customer_data 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 7. INVOICE_RETURNS
-- =====================================================
-- Invoice returns should be branch-specific
ALTER TABLE invoice_returns 
ADD COLUMN branch_id BIGINT;

ALTER TABLE invoice_returns 
ADD CONSTRAINT fk_invoice_returns_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_invoice_returns_branch_id ON invoice_returns(branch_id);

-- Migrate from invoice
UPDATE invoice_returns ir
SET branch_id = (
    SELECT i.branch_id 
    FROM invoices i 
    WHERE i.id = ir.invoice_id
);

ALTER TABLE invoice_returns 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 8. RETURN_INVOICE_DATA
-- =====================================================
-- Return invoice data should be branch-specific
ALTER TABLE return_invoice_data 
ADD COLUMN branch_id BIGINT;

ALTER TABLE return_invoice_data 
ADD CONSTRAINT fk_return_invoice_data_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_return_invoice_data_branch_id ON return_invoice_data(branch_id);

-- Migrate from invoice
UPDATE return_invoice_data rid
SET branch_id = (
    SELECT i.branch_id 
    FROM invoices i 
    WHERE i.invoice_number = rid.invoice_number
    LIMIT 1
);

-- Fallback to main branch
UPDATE return_invoice_data
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE return_invoice_data 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 9. PATIENT_NUMBERS
-- =====================================================
-- Patient numbering should be branch-specific
ALTER TABLE patient_numbers 
ADD COLUMN branch_id BIGINT;

ALTER TABLE patient_numbers 
ADD CONSTRAINT fk_patient_numbers_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;

CREATE INDEX idx_patient_numbers_branch_id ON patient_numbers(branch_id);

-- Assign to main branch for historical data
UPDATE patient_numbers
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1);

ALTER TABLE patient_numbers 
ALTER COLUMN branch_id SET NOT NULL;

-- Add unique constraint on (branch_id, today) to ensure one counter per branch per day
ALTER TABLE patient_numbers 
ADD CONSTRAINT uk_patient_numbers_branch_date UNIQUE (branch_id, today);

-- =====================================================
-- 10. BANK_DATA
-- =====================================================
-- Bank transactions should be branch-specific
ALTER TABLE bank_data 
ADD COLUMN branch_id BIGINT;

ALTER TABLE bank_data 
ADD CONSTRAINT fk_bank_data_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_bank_data_branch_id ON bank_data(branch_id);

-- Migrate from user's branch
UPDATE bank_data bd
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = bd.user_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- Fallback to main branch
UPDATE bank_data
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE bank_data 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 11. INCOMING_CHEQUES
-- =====================================================
-- Incoming cheques should be branch-specific
ALTER TABLE incoming_cheques 
ADD COLUMN branch_id BIGINT;

ALTER TABLE incoming_cheques 
ADD CONSTRAINT fk_incoming_cheques_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_incoming_cheques_branch_id ON incoming_cheques(branch_id);

-- Migrate from related bank_data
UPDATE incoming_cheques ic
SET branch_id = (
    SELECT bd.branch_id 
    FROM bank_data bd 
    WHERE bd.id = ic.bank_data_id
)
WHERE ic.bank_data_id IS NOT NULL;

-- For cheques from customers, use invoice branch
UPDATE incoming_cheques ic
SET branch_id = (
    SELECT i.branch_id 
    FROM invoices i 
    WHERE i.customer_id = ic.customer_id
    ORDER BY i.invoice_date DESC
    LIMIT 1
)
WHERE branch_id IS NULL AND ic.customer_id IS NOT NULL;

-- Fallback to main branch
UPDATE incoming_cheques
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE incoming_cheques 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 12. ATTENDANCE
-- =====================================================
-- Employee attendance should be branch-specific
ALTER TABLE attendance 
ADD COLUMN branch_id BIGINT;

ALTER TABLE attendance 
ADD CONSTRAINT fk_attendance_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_attendance_branch_id ON attendance(branch_id);

-- Migrate from employee's primary branch
UPDATE attendance a
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = (SELECT user_id FROM employees e WHERE e.id = a.employee_id LIMIT 1)
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- Fallback to main branch
UPDATE attendance
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE attendance 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- 13. EMPLOYEE_PAYMENTS
-- =====================================================
-- Employee payments should be branch-specific
ALTER TABLE employee_payments 
ADD COLUMN branch_id BIGINT;

ALTER TABLE employee_payments 
ADD CONSTRAINT fk_employee_payments_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

CREATE INDEX idx_employee_payments_branch_id ON employee_payments(branch_id);

-- Migrate from user's primary branch
UPDATE employee_payments ep
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = ep.user_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- Fallback to main branch
UPDATE employee_payments
SET branch_id = (SELECT id FROM branches WHERE is_main_branch = TRUE LIMIT 1)
WHERE branch_id IS NULL;

ALTER TABLE employee_payments 
ALTER COLUMN branch_id SET NOT NULL;

-- =====================================================
-- OPTIONAL: AUDIT_LOGS (for better tracking)
-- =====================================================
-- Uncomment if you want branch-specific audit trails
/*
ALTER TABLE audit_logs 
ADD COLUMN branch_id BIGINT;

ALTER TABLE audit_logs 
ADD CONSTRAINT fk_audit_logs_branch 
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL;

CREATE INDEX idx_audit_logs_branch_id ON audit_logs(branch_id);

-- Migrate from user's primary branch
UPDATE audit_logs al
SET branch_id = (
    SELECT bs.branch_id 
    FROM branch_staff bs 
    WHERE bs.user_id = al.user_id 
    AND bs.is_primary_branch = TRUE 
    AND bs.is_active = TRUE
    LIMIT 1
);

-- Note: We don't make this NOT NULL as some system-level audits might not have a branch
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after migration to verify

-- Check for any NULL branch_ids (should return 0 rows for each)
SELECT 'employee_authorizations' as table_name, COUNT(*) as null_count FROM employee_authorizations WHERE branch_id IS NULL
UNION ALL
SELECT 'supplier_payments', COUNT(*) FROM supplier_payments WHERE branch_id IS NULL
UNION ALL
SELECT 'payments', COUNT(*) FROM payments WHERE branch_id IS NULL
UNION ALL
SELECT 'grn_temp', COUNT(*) FROM grn_temp WHERE branch_id IS NULL
UNION ALL
SELECT 'expiry_data', COUNT(*) FROM expiry_data WHERE branch_id IS NULL
UNION ALL
SELECT 'customer_data', COUNT(*) FROM customer_data WHERE branch_id IS NULL
UNION ALL
SELECT 'invoice_returns', COUNT(*) FROM invoice_returns WHERE branch_id IS NULL
UNION ALL
SELECT 'return_invoice_data', COUNT(*) FROM return_invoice_data WHERE branch_id IS NULL
UNION ALL
SELECT 'patient_numbers', COUNT(*) FROM patient_numbers WHERE branch_id IS NULL
UNION ALL
SELECT 'bank_data', COUNT(*) FROM bank_data WHERE branch_id IS NULL
UNION ALL
SELECT 'incoming_cheques', COUNT(*) FROM incoming_cheques WHERE branch_id IS NULL
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance WHERE branch_id IS NULL
UNION ALL
SELECT 'employee_payments', COUNT(*) FROM employee_payments WHERE branch_id IS NULL;

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND kcu.column_name = 'branch_id'
ORDER BY tc.table_name;

COMMIT;

-- =====================================================
-- ROLLBACK SCRIPT (IF NEEDED)
-- =====================================================
-- Run this only if you need to rollback the changes
-- WARNING: This will remove branch isolation!

/*
BEGIN;

ALTER TABLE employee_authorizations DROP CONSTRAINT IF EXISTS fk_employee_authorizations_branch;
ALTER TABLE employee_authorizations DROP COLUMN IF EXISTS branch_id;

ALTER TABLE supplier_payments DROP CONSTRAINT IF EXISTS fk_supplier_payments_branch;
ALTER TABLE supplier_payments DROP COLUMN IF EXISTS branch_id;

ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payments_branch;
ALTER TABLE payments DROP COLUMN IF EXISTS branch_id;

ALTER TABLE grn_temp DROP CONSTRAINT IF EXISTS fk_grn_temp_branch;
ALTER TABLE grn_temp DROP COLUMN IF EXISTS branch_id;

ALTER TABLE expiry_data DROP CONSTRAINT IF EXISTS fk_expiry_data_branch;
ALTER TABLE expiry_data DROP COLUMN IF EXISTS branch_id;

ALTER TABLE customer_data DROP CONSTRAINT IF EXISTS fk_customer_data_branch;
ALTER TABLE customer_data DROP COLUMN IF EXISTS branch_id;

ALTER TABLE invoice_returns DROP CONSTRAINT IF EXISTS fk_invoice_returns_branch;
ALTER TABLE invoice_returns DROP COLUMN IF EXISTS branch_id;

ALTER TABLE return_invoice_data DROP CONSTRAINT IF EXISTS fk_return_invoice_data_branch;
ALTER TABLE return_invoice_data DROP COLUMN IF EXISTS branch_id;

ALTER TABLE patient_numbers DROP CONSTRAINT IF EXISTS uk_patient_numbers_branch_date;
ALTER TABLE patient_numbers DROP CONSTRAINT IF EXISTS fk_patient_numbers_branch;
ALTER TABLE patient_numbers DROP COLUMN IF EXISTS branch_id;

ALTER TABLE bank_data DROP CONSTRAINT IF EXISTS fk_bank_data_branch;
ALTER TABLE bank_data DROP COLUMN IF EXISTS branch_id;

ALTER TABLE incoming_cheques DROP CONSTRAINT IF EXISTS fk_incoming_cheques_branch;
ALTER TABLE incoming_cheques DROP COLUMN IF EXISTS branch_id;

ALTER TABLE attendance DROP CONSTRAINT IF EXISTS fk_attendance_branch;
ALTER TABLE attendance DROP COLUMN IF EXISTS branch_id;

ALTER TABLE employee_payments DROP CONSTRAINT IF EXISTS fk_employee_payments_branch;
ALTER TABLE employee_payments DROP COLUMN IF EXISTS branch_id;

COMMIT;
*/

-- =====================================================
-- NOTES
-- =====================================================
-- 1. This migration adds branch_id to 13 tables
-- 2. Existing data is migrated using logical relationships
-- 3. Falls back to main branch when relationships can't be determined
-- 4. All branch_id fields are set to NOT NULL after migration
-- 5. Foreign key constraints ensure referential integrity
-- 6. Indexes are created for performance
-- 7. Run verification queries after migration to ensure success
-- 8. Back up your database before running this script!
-- =====================================================
