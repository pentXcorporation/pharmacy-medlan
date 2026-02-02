package com.pharmacy.medlan.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@Component
@Profile("migration")
public class DatabaseMigrationRunner implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationRunner.class);
    private final JdbcTemplate jdbcTemplate;
    
    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("========================================");
        logger.info("Starting Branch Isolation Migration");
        logger.info("========================================");
        
        try {
            // Check which tables already have branch_id
            checkExistingBranchColumns();
            
            // Execute migrations for each table
            migrateEmployeeAuthorizations();
            migrateSupplierPayments();
            migrateGRNTemp();
            migrateExpiryData();
            migrateCustomerData();
            migrateInvoiceReturns();
            migrateReturnInvoiceData();
            migratePatientNumbers();
            migrateBankData();
            migrateIncomingCheques();
            migrateAttendance();
            migrateEmployeePayments();
            
            // Verify migrations
            verifyMigrations();
            
            logger.info("========================================");
            logger.info("Migration completed successfully!");
            logger.info("========================================");
            
        } catch (Exception e) {
            logger.error("Migration failed: " + e.getMessage(), e);
            throw e;
        }
    }
    
    private void checkExistingBranchColumns() {
        logger.info("Checking existing branch_id columns...");
        
        String query = """
            SELECT table_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND column_name = 'branch_id'
            ORDER BY table_name
        """;
        
        List<Map<String, Object>> result = jdbcTemplate.queryForList(query);
        logger.info("Found {} tables with branch_id column", result.size());
        result.forEach(row -> logger.info("  - {}", row.get("table_name")));
    }
    
    private void migrateEmployeeAuthorizations() {
        logger.info("Migrating employee_authorizations...");
        
        if (!columnExists("employee_authorizations", "branch_id")) {
            // Add column
            jdbcTemplate.execute("""
                ALTER TABLE employee_authorizations
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Migrate data - get branch from employee via branch_staff
            jdbcTemplate.execute("""
                UPDATE employee_authorizations ea
                SET branch_id = (
                    SELECT bs.branch_id
                    FROM branch_staff bs
                    WHERE bs.employee_id = ea.employee_id
                    LIMIT 1
                )
                WHERE branch_id IS NULL
            """);
            
            // Set NOT NULL and add FK
            jdbcTemplate.execute("""
                ALTER TABLE employee_authorizations
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE employee_authorizations
                ADD CONSTRAINT fk_employee_authorizations_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ employee_authorizations migrated");
        } else {
            logger.info("✓ employee_authorizations already has branch_id");
        }
    }
    
    private void migrateSupplierPayments() {
        logger.info("Migrating supplier_payments...");
        
        if (!columnExists("supplier_payments", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE supplier_payments
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Migrate data - get branch from related GRN
            jdbcTemplate.execute("""
                UPDATE supplier_payments sp
                SET branch_id = (
                    SELECT g.branch_id
                    FROM grn g
                    WHERE g.supplier_id = sp.supplier_id
                    ORDER BY g.created_at DESC
                    LIMIT 1
                )
                WHERE branch_id IS NULL AND EXISTS (
                    SELECT 1 FROM grn WHERE supplier_id = sp.supplier_id
                )
            """);
            
            // Set default branch (1) for any remaining records
            jdbcTemplate.execute("""
                UPDATE supplier_payments
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE supplier_payments
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE supplier_payments
                ADD CONSTRAINT fk_supplier_payments_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ supplier_payments migrated");
        } else {
            logger.info("✓ supplier_payments already has branch_id");
        }
    }
    
    private void migrateGRNTemp() {
        logger.info("Migrating grn_temp...");
        
        if (!columnExists("grn_temp", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE grn_temp
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Default to branch 1 (main branch)
            jdbcTemplate.execute("""
                UPDATE grn_temp
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE grn_temp
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE grn_temp
                ADD CONSTRAINT fk_grn_temp_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ grn_temp migrated");
        } else {
            logger.info("✓ grn_temp already has branch_id");
        }
    }
    
    private void migrateExpiryData() {
        logger.info("Migrating expiry_data...");
        
        if (!columnExists("expiry_data", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE expiry_data
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Migrate from branch_inventory if product_id matches
            jdbcTemplate.execute("""
                UPDATE expiry_data ed
                SET branch_id = (
                    SELECT bi.branch_id
                    FROM branch_inventory bi
                    WHERE bi.product_id = ed.product_id
                    LIMIT 1
                )
                WHERE branch_id IS NULL AND EXISTS (
                    SELECT 1 FROM branch_inventory WHERE product_id = ed.product_id
                )
            """);
            
            // Default to branch 1
            jdbcTemplate.execute("""
                UPDATE expiry_data
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE expiry_data
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE expiry_data
                ADD CONSTRAINT fk_expiry_data_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ expiry_data migrated");
        } else {
            logger.info("✓ expiry_data already has branch_id");
        }
    }
    
    private void migrateCustomerData() {
        logger.info("Migrating customer_data...");
        
        if (!columnExists("customer_data", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE customer_data
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from related sales
            jdbcTemplate.execute("""
                UPDATE customer_data cd
                SET branch_id = (
                    SELECT s.branch_id
                    FROM sales s
                    WHERE s.customer_id = cd.customer_id
                    ORDER BY s.created_at DESC
                    LIMIT 1
                )
                WHERE branch_id IS NULL AND EXISTS (
                    SELECT 1 FROM sales WHERE customer_id = cd.customer_id
                )
            """);
            
            jdbcTemplate.execute("""
                UPDATE customer_data
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE customer_data
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE customer_data
                ADD CONSTRAINT fk_customer_data_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ customer_data migrated");
        } else {
            logger.info("✓ customer_data already has branch_id");
        }
    }
    
    private void migrateInvoiceReturns() {
        logger.info("Migrating invoice_returns...");
        
        if (!columnExists("invoice_returns", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE invoice_returns
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from original sale
            jdbcTemplate.execute("""
                UPDATE invoice_returns ir
                SET branch_id = (
                    SELECT s.branch_id
                    FROM sales s
                    WHERE s.id = ir.sale_id
                )
                WHERE branch_id IS NULL AND sale_id IS NOT NULL
            """);
            
            jdbcTemplate.execute("""
                UPDATE invoice_returns
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE invoice_returns
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE invoice_returns
                ADD CONSTRAINT fk_invoice_returns_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ invoice_returns migrated");
        } else {
            logger.info("✓ invoice_returns already has branch_id");
        }
    }
    
    private void migrateReturnInvoiceData() {
        logger.info("Migrating return_invoice_data...");
        
        if (!columnExists("return_invoice_data", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE return_invoice_data
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from invoice_returns
            jdbcTemplate.execute("""
                UPDATE return_invoice_data rid
                SET branch_id = (
                    SELECT ir.branch_id
                    FROM invoice_returns ir
                    WHERE ir.id = rid.return_id
                )
                WHERE branch_id IS NULL AND return_id IS NOT NULL
            """);
            
            jdbcTemplate.execute("""
                UPDATE return_invoice_data
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE return_invoice_data
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE return_invoice_data
                ADD CONSTRAINT fk_return_invoice_data_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ return_invoice_data migrated");
        } else {
            logger.info("✓ return_invoice_data already has branch_id");
        }
    }
    
    private void migratePatientNumbers() {
        logger.info("Migrating patient_numbers...");
        
        if (!columnExists("patient_numbers", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE patient_numbers
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from related sales
            jdbcTemplate.execute("""
                UPDATE patient_numbers pn
                SET branch_id = (
                    SELECT s.branch_id
                    FROM sales s
                    WHERE s.patient_number = pn.patient_number
                    ORDER BY s.created_at DESC
                    LIMIT 1
                )
                WHERE branch_id IS NULL AND EXISTS (
                    SELECT 1 FROM sales WHERE patient_number = pn.patient_number
                )
            """);
            
            jdbcTemplate.execute("""
                UPDATE patient_numbers
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE patient_numbers
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE patient_numbers
                ADD CONSTRAINT fk_patient_numbers_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ patient_numbers migrated");
        } else {
            logger.info("✓ patient_numbers already has branch_id");
        }
    }
    
    private void migrateBankData() {
        logger.info("Migrating bank_data...");
        
        if (!columnExists("bank_data", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE bank_data
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            jdbcTemplate.execute("""
                UPDATE bank_data
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE bank_data
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE bank_data
                ADD CONSTRAINT fk_bank_data_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ bank_data migrated");
        } else {
            logger.info("✓ bank_data already has branch_id");
        }
    }
    
    private void migrateIncomingCheques() {
        logger.info("Migrating incoming_cheques...");
        
        if (!columnExists("incoming_cheques", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE incoming_cheques
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from related sales payment
            jdbcTemplate.execute("""
                UPDATE incoming_cheques ic
                SET branch_id = (
                    SELECT s.branch_id
                    FROM sales s
                    WHERE s.id = ic.sale_id
                )
                WHERE branch_id IS NULL AND sale_id IS NOT NULL
            """);
            
            jdbcTemplate.execute("""
                UPDATE incoming_cheques
                SET branch_id = 1
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE incoming_cheques
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE incoming_cheques
                ADD CONSTRAINT fk_incoming_cheques_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ incoming_cheques migrated");
        } else {
            logger.info("✓ incoming_cheques already has branch_id");
        }
    }
    
    private void migrateAttendance() {
        logger.info("Migrating attendance...");
        
        if (!columnExists("attendance", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE attendance
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from employee via branch_staff
            jdbcTemplate.execute("""
                UPDATE attendance a
                SET branch_id = (
                    SELECT bs.branch_id
                    FROM branch_staff bs
                    WHERE bs.employee_id = a.employee_id
                    LIMIT 1
                )
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE attendance
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE attendance
                ADD CONSTRAINT fk_attendance_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ attendance migrated");
        } else {
            logger.info("✓ attendance already has branch_id");
        }
    }
    
    private void migrateEmployeePayments() {
        logger.info("Migrating employee_payments...");
        
        if (!columnExists("employee_payments", "branch_id")) {
            jdbcTemplate.execute("""
                ALTER TABLE employee_payments
                ADD COLUMN IF NOT EXISTS branch_id BIGINT
            """);
            
            // Get branch from employee via branch_staff
            jdbcTemplate.execute("""
                UPDATE employee_payments ep
                SET branch_id = (
                    SELECT bs.branch_id
                    FROM branch_staff bs
                    WHERE bs.employee_id = ep.employee_id
                    LIMIT 1
                )
                WHERE branch_id IS NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE employee_payments
                ALTER COLUMN branch_id SET NOT NULL
            """);
            
            jdbcTemplate.execute("""
                ALTER TABLE employee_payments
                ADD CONSTRAINT fk_employee_payments_branch
                FOREIGN KEY (branch_id) REFERENCES branches(id)
            """);
            
            logger.info("✓ employee_payments migrated");
        } else {
            logger.info("✓ employee_payments already has branch_id");
        }
    }
    
    private void verifyMigrations() {
        logger.info("Verifying migrations...");
        
        String[] tables = {
            "employee_authorizations", "supplier_payments", "grn_temp",
            "expiry_data", "customer_data", "invoice_returns",
            "return_invoice_data", "patient_numbers", "bank_data",
            "incoming_cheques", "attendance", "employee_payments"
        };
        
        for (String table : tables) {
            String query = String.format(
                "SELECT COUNT(*) FROM %s WHERE branch_id IS NULL",
                table
            );
            
            Integer nullCount = jdbcTemplate.queryForObject(query, Integer.class);
            if (nullCount != null && nullCount > 0) {
                logger.warn("⚠ {} has {} records with NULL branch_id", table, nullCount);
            } else {
                logger.info("✓ {} - All records have branch_id", table);
            }
        }
        
        logger.info("Verification complete!");
    }
    
    private boolean columnExists(String tableName, String columnName) {
        String query = """
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = ?
            AND column_name = ?
        """;
        
        Integer count = jdbcTemplate.queryForObject(query, Integer.class, tableName, columnName);
        return count != null && count > 0;
    }
}
