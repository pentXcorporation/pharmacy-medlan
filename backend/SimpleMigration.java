import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SimpleMigration {
    
    private static final String URL = "jdbc:postgresql://ep-soft-voice-ah4bk8qm-pooler.c-3.us-east-1.aws.neon.tech/neondb?user=neondb_owner&password=npg_QtoE8KpxlFy4&sslmode=require";
    
    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("Branch Isolation Database Migration");
        System.out.println("========================================\n");
        
        try (Connection conn = DriverManager.getConnection(URL)) {
            System.out.println("✓ Database connection established\n");
            
            // Check existing branch_id columns
            checkExistingColumns(conn);
            
            // Run migrations
            migrateTable(conn, "employee_authorizations", 
                "SELECT bs.branch_id FROM branch_staff bs JOIN users u ON bs.user_id = u.id WHERE u.employee_id = employee_authorizations.employee_id LIMIT 1");
            
            migrateTable(conn, "supplier_payments",
                "SELECT g.branch_id FROM grns g WHERE g.supplier_id = supplier_payments.supplier_id ORDER BY g.created_at DESC LIMIT 1");
            
            migrateTableIfNotExists(conn, "grn_temp", "1");
            
            migrateTableIfNotExists(conn, "expiry_data",
                "SELECT bi.branch_id FROM branch_inventory bi WHERE bi.product_id = expiry_data.product_id LIMIT 1");
            
            migrateTableIfNotExists(conn, "customer_data",
                "SELECT s.branch_id FROM sales s WHERE s.customer_id = customer_data.customer_id ORDER BY s.created_at DESC LIMIT 1");
            
            migrateTableIfNotExists(conn, "invoice_returns",
                "SELECT s.branch_id FROM sales s WHERE s.id = invoice_returns.sale_id");
            
            migrateTableIfNotExists(conn, "return_invoice_data",
                "SELECT ir.branch_id FROM invoice_returns ir WHERE ir.id = return_invoice_data.return_id");
            
            migrateTableIfNotExists(conn, "patient_numbers",
                "SELECT s.branch_id FROM sales s WHERE s.patient_number = patient_numbers.patient_number ORDER BY s.created_at DESC LIMIT 1");
            
            migrateTableIfNotExists(conn, "bank_data", "1");
            
            migrateTableIfNotExists(conn, "incoming_cheques",
                "SELECT s.branch_id FROM sales s WHERE s.id = incoming_cheques.sale_id");
            
            migrateTable(conn, "attendance",
                "SELECT bs.branch_id FROM branch_staff bs JOIN users u ON bs.user_id = u.id WHERE u.employee_id = attendance.employee_id LIMIT 1");
            
            migrateTable(conn, "employee_payments",
                "SELECT bs.branch_id FROM branch_staff bs WHERE bs.user_id = employee_payments.user_id LIMIT 1");
            
            // Verify
            verifyMigrations(conn);
            
            System.out.println("\n========================================");
            System.out.println("✓ Migration completed successfully!");
            System.out.println("========================================");
            
        } catch (Exception e) {
            System.err.println("✗ Migration failed: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    private static void checkExistingColumns(Connection conn) throws SQLException {
        System.out.println("Checking existing branch_id columns...");
        
        String query = """
            SELECT table_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND column_name = 'branch_id'
            ORDER BY table_name
        """;
        
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            int count = 0;
            while (rs.next()) {
                System.out.println("  - " + rs.getString("table_name"));
                count++;
            }
            System.out.println("Found " + count + " tables with branch_id\n");
        }
    }
    
    private static void migrateTableIfNotExists(Connection conn, String tableName, String branchQuery) throws SQLException {
        // Only migrate if table exists
        if (!tableExists(conn, tableName)) {
            System.out.println("Skipping " + tableName + " (table does not exist)\n");
            return;
        }
        migrateTable(conn, tableName, branchQuery);
    }
    
    private static void migrateTable(Connection conn, String tableName, String branchQuery) throws SQLException {
        System.out.println("Migrating " + tableName + "...");
        
        // Check if table exists
        if (!tableExists(conn, tableName)) {
            System.out.println("  ⊘ Table does not exist\n");
            return;
        }
        
        // Check if column exists
        boolean columnExists = columnExists(conn, tableName, "branch_id");
        
        try (Statement stmt = conn.createStatement()) {
            if (!columnExists) {
                // Add column
                stmt.execute("ALTER TABLE " + tableName + " ADD COLUMN branch_id BIGINT");
                System.out.println("  + Added branch_id column");
            } else {
                System.out.println("  ✓ Column already exists");
            }
            
            // Check if there are NULL values
            String checkNullSql = "SELECT COUNT(*) as cnt FROM " + tableName + " WHERE branch_id IS NULL";
            int nullCount = 0;
            
            try (ResultSet rs = stmt.executeQuery(checkNullSql)) {
                if (rs.next()) {
                    nullCount = rs.getInt("cnt");
                }
            }
            
            if (nullCount == 0) {
                System.out.println("  ✓ All records already have branch_id\n");
                return;
            }
            
            System.out.println("  • Found " + nullCount + " records with NULL branch_id");
            
            // Update data
            if (branchQuery.equals("1")) {
                stmt.execute("UPDATE " + tableName + " SET branch_id = 1 WHERE branch_id IS NULL");
            } else {
                stmt.execute("UPDATE " + tableName + " SET branch_id = (" + branchQuery + ") WHERE branch_id IS NULL");
                // Set remaining to branch 1
                stmt.execute("UPDATE " + tableName + " SET branch_id = 1 WHERE branch_id IS NULL");
            }
            System.out.println("  + Migrated data");
            
            // Set NOT NULL
            stmt.execute("ALTER TABLE " + tableName + " ALTER COLUMN branch_id SET NOT NULL");
            System.out.println("  + Set NOT NULL constraint");
            
            // Add FK if not exists
            String fkName = "fk_" + tableName + "_branch";
            if (!constraintExists(conn, tableName, fkName)) {
                stmt.execute("ALTER TABLE " + tableName + 
                            " ADD CONSTRAINT " + fkName + 
                            " FOREIGN KEY (branch_id) REFERENCES branches(id)");
                System.out.println("  + Added foreign key constraint");
            } else {
                System.out.println("  ✓ Foreign key already exists");
            }
            
            System.out.println("  ✓ Migration complete\n");
            
        } catch (SQLException e) {
            System.err.println("  ✗ Error: " + e.getMessage() + "\n");
            throw e;
        }
    }
    
    private static boolean columnExists(Connection conn, String tableName, String columnName) throws SQLException {
        String query = """
            SELECT COUNT(*) as cnt FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = ?
            AND column_name = ?
        """;
        
        try (PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, tableName);
            pstmt.setString(2, columnName);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("cnt") > 0;
                }
            }
        }
        return false;
    }
    
    private static boolean tableExists(Connection conn, String tableName) throws SQLException {
        String query = """
            SELECT COUNT(*) as cnt FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = ?
        """;
        
        try (PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, tableName);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("cnt") > 0;
                }
            }
        }
        return false;
    }
    
    private static boolean constraintExists(Connection conn, String tableName, String constraintName) throws SQLException {
        String query = """
            SELECT COUNT(*) as cnt FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND table_name = ?
            AND constraint_name = ?
        """;
        
        try (PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, tableName);
            pstmt.setString(2, constraintName);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("cnt") > 0;
                }
            }
        }
        return false;
    }
    
    private static void verifyMigrations(Connection conn) throws SQLException {
        System.out.println("Verifying migrations...");
        
        String[] tables = {
            "employee_authorizations", "supplier_payments", "grn_temp",
            "expiry_data", "customer_data", "invoice_returns",
            "return_invoice_data", "patient_numbers", "bank_data",
            "incoming_cheques", "attendance", "employee_payments"
        };
        
        for (String table : tables) {
            String query = "SELECT COUNT(*) as cnt FROM " + table + " WHERE branch_id IS NULL";
            
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                
                if (rs.next()) {
                    int nullCount = rs.getInt("cnt");
                    if (nullCount > 0) {
                        System.out.println("  ⚠ " + table + " has " + nullCount + " records with NULL branch_id");
                    } else {
                        System.out.println("  ✓ " + table + " - All records have branch_id");
                    }
                }
            }
        }
    }
}
