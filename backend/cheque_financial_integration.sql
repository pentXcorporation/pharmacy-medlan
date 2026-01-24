-- =====================================================
-- Cheque Financial Integration Migration
-- =====================================================
-- This migration adds financial tracking fields to the
-- incoming_cheques table and integrates with BankData

-- Add new columns to incoming_cheques table
ALTER TABLE incoming_cheques
ADD COLUMN IF NOT EXISTS bank_data_id BIGINT,
ADD COLUMN IF NOT EXISTS is_recorded_in_bank BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reconciled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reconciliation_date DATE,
ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS bounce_reason VARCHAR(500),
ADD COLUMN IF NOT EXISTS bounce_date DATE,
ADD COLUMN IF NOT EXISTS bounce_charges DECIMAL(10, 2) DEFAULT 0.00;

-- Add foreign key constraint to bank_data
ALTER TABLE incoming_cheques
ADD CONSTRAINT fk_cheque_bank_data 
FOREIGN KEY (bank_data_id) REFERENCES bank_data(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_cheque_reconciled ON incoming_cheques(reconciled);
CREATE INDEX IF NOT EXISTS idx_cheque_recorded_in_bank ON incoming_cheques(is_recorded_in_bank);
CREATE INDEX IF NOT EXISTS idx_cheque_reference ON incoming_cheques(reference_number);

-- Update existing cheques to set default values
UPDATE incoming_cheques 
SET 
  is_recorded_in_bank = FALSE,
  reconciled = FALSE,
  bounce_charges = 0.00
WHERE is_recorded_in_bank IS NULL;

-- =====================================================
-- Add REPLACED status to cheque_status enum if needed
-- Note: This depends on your database. For PostgreSQL:
-- =====================================================
-- ALTER TYPE cheque_status ADD VALUE IF NOT EXISTS 'REPLACED';

-- For MySQL, no action needed as ENUM is defined in the entity

COMMIT;
