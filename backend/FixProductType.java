import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class FixProductType {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://ep-soft-voice-ah4bk8qm-pooler.c-3.us-east-1.aws.neon.tech/neondb?user=neondb_owner&password=npg_QtoE8KpxlFy4&sslmode=require";
        try (Connection c = DriverManager.getConnection(url); Statement s = c.createStatement()) {
            ResultSet rs = s.executeQuery("SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='product_type'");
            if (rs.next()) {
                System.out.println("Column exists, updating nulls...");
                int updated = s.executeUpdate("UPDATE products SET product_type = 'MEDICAL' WHERE product_type IS NULL");
                System.out.println("Updated " + updated + " rows");
                s.executeUpdate("ALTER TABLE products ALTER COLUMN product_type SET NOT NULL");
                s.executeUpdate("ALTER TABLE products ALTER COLUMN product_type SET DEFAULT 'MEDICAL'");
            } else {
                System.out.println("Column does not exist, adding with default...");
                s.executeUpdate("ALTER TABLE products ADD COLUMN product_type VARCHAR(50) NOT NULL DEFAULT 'MEDICAL'");
            }
            System.out.println("Done!");
        }
    }
}
