-- Migration script to change employee_payments to reference users table instead of employees

-- Step 1: Add new user_id column
ALTER TABLE employee_payments ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- Step 2: Copy existing data from employee_id to user_id (if needed)
-- UPDATE employee_payments SET user_id = employee_id WHERE user_id IS NULL;

-- Step 3: Drop old foreign key constraint
ALTER TABLE employee_payments DROP CONSTRAINT IF EXISTS fkprrrb1bwvbwxm2mhhqewdixao;

-- Step 4: Drop old employee_id column (optional - keep for data migration if needed)
-- ALTER TABLE employee_payments DROP COLUMN IF EXISTS employee_id;

-- Step 5: Add foreign key constraint to users table
ALTER TABLE employee_payments 
ADD CONSTRAINT fk_employee_payments_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Step 6: Make user_id NOT NULL after data migration
-- ALTER TABLE employee_payments ALTER COLUMN user_id SET NOT NULL;

SELECT 'Migration completed successfully' AS status;
