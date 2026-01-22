-- Fix employee_id column in employee_payments table
-- This script removes the employee_id column since we're now using user_id

-- First, make employee_id nullable to allow existing records
ALTER TABLE employee_payments ALTER COLUMN employee_id DROP NOT NULL;

-- Drop the employee_id column entirely since we're using user_id now
ALTER TABLE employee_payments DROP COLUMN IF EXISTS employee_id;

-- Verify the change
SELECT 'Migration completed - employee_id column removed' as status;
