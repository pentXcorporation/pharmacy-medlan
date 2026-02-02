import java.sql.*;

public class CheckSchema {
    
    private static final String URL = "jdbc:postgresql://ep-soft-voice-ah4bk8qm-pooler.c-3.us-east-1.aws.neon.tech/neondb?user=neondb_owner&password=npg_QtoE8KpxlFy4&sslmode=require";
    
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection(URL)) {
            System.out.println("✓ Connected\n");
            
            checkTable(conn, "employee_authorizations");
            checkTable(conn, "branch_staff");
            checkTable(conn, "supplier_payments");
            checkTable(conn, "grns");
            checkTable(conn, "attendance");
            checkTable(conn, "employee_payments");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static void checkTable(Connection conn, String tableName) throws SQLException {
        System.out.println("Table: " + tableName);
        
        String query = """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = ?
            ORDER BY ordinal_position
        """;
        
        try (PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setString(1, tableName);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    System.out.printf("  - %s (%s) %s\n",
                        rs.getString("column_name"),
                        rs.getString("data_type"),
                        rs.getString("is_nullable").equals("NO") ? "NOT NULL" : "NULL");
                }
            }
        }
        System.out.println();
    }
}
