# Product Table Refactoring Guide
## Supporting Medical and Non-Medical Products

---

## 📋 Overview

This guide explains how to refactor your pharmacy management system to support both medical products (medicines) and non-medical products (food items, cosmetics, supplements, etc.) in a single, efficient database structure.

---

## 🎯 The Problem

Your current `products` table has:
- **Medical-specific fields** with NOT NULL constraints (dosage_form, drug_schedule, is_narcotic, etc.)
- **CHECK constraints** that only allow medical values
- These constraints prevent storing non-medical products like food or cosmetics

---

## ✅ Recommended Solution: Single Table Inheritance (STI)

### Why This Approach?

1. **Maintains existing relationships** - All your foreign keys continue to work
2. **Minimal code changes** - Your existing queries mostly work as-is
3. **Simple to implement** - Just add columns and modify constraints
4. **Good performance** - No joins needed for basic product queries
5. **Flexible** - Easy to add new product types in the future

### Alternative Approaches (NOT Recommended)

❌ **Separate Tables** (products_medical, products_food, etc.)
- Breaks existing foreign keys
- Requires complex queries with UNION
- Difficult to maintain inventory across types

❌ **EAV (Entity-Attribute-Value)**
- Overly complex for your needs
- Poor query performance
- Difficult to validate data

---

## 🔧 Implementation Steps

### Step 1: Add Product Type Column

```sql
ALTER TABLE public.products 
ADD COLUMN product_type VARCHAR(50) NOT NULL DEFAULT 'MEDICAL';

ALTER TABLE public.products
ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('MEDICAL', 'FOOD', 'COSMETIC', 'SUPPLEMENT', 'GENERAL'));
```

**Product Types:**
- `MEDICAL` - Medicines, drugs
- `FOOD` - Food items, beverages, snacks
- `COSMETIC` - Beauty products, personal care
- `SUPPLEMENT` - Vitamins, health supplements
- `GENERAL` - Other retail items

### Step 2: Make Medical Fields Optional

```sql
-- Remove NOT NULL constraints
ALTER TABLE public.products 
ALTER COLUMN is_narcotic DROP NOT NULL,
ALTER COLUMN is_prescription_required DROP NOT NULL,
ALTER COLUMN is_refrigerated DROP NOT NULL;

-- Allow NULL in CHECK constraints
ALTER TABLE public.products 
DROP CONSTRAINT products_dosage_form_check;

ALTER TABLE public.products 
ADD CONSTRAINT products_dosage_form_check 
CHECK (dosage_form IS NULL OR dosage_form IN ('TABLET', 'CAPSULE', ...));
```

### Step 3: Add Type-Specific Validation

```sql
ALTER TABLE public.products 
ADD CONSTRAINT products_medical_fields_check 
CHECK (
  (product_type != 'MEDICAL') OR 
  (product_type = 'MEDICAL' AND dosage_form IS NOT NULL)
);
```

This ensures medical products still have required medical fields!

### Step 4: Add New Product Type Fields

**For Food Products:**
```sql
ALTER TABLE public.products 
ADD COLUMN ingredients TEXT,
ADD COLUMN nutritional_info JSONB,
ADD COLUMN allergen_info TEXT,
ADD COLUMN shelf_life_days INTEGER;
```

**For Cosmetics:**
```sql
ALTER TABLE public.products 
ADD COLUMN skin_type VARCHAR(100),
ADD COLUMN usage_instructions TEXT;
```

**For All Products:**
```sql
ALTER TABLE public.products 
ADD COLUMN country_of_origin VARCHAR(100),
ADD COLUMN additional_attributes JSONB;
```

---

## 📊 Database Schema Changes

### Before (Medical Only)
```
products
├── id
├── product_name
├── dosage_form (NOT NULL) ❌
├── drug_schedule (NOT NULL) ❌
├── is_narcotic (NOT NULL) ❌
└── ...
```

### After (Multi-Product)
```
products
├── id
├── product_name
├── product_type (NEW) ✓
├── dosage_form (nullable) ✓
├── drug_schedule (nullable) ✓
├── is_narcotic (nullable) ✓
├── ingredients (NEW) ✓
├── nutritional_info (NEW) ✓
└── ...
```

---

## 💻 Application Code Changes

### Java/Spring Boot Example

#### Before:
```java
@Entity
@Table(name = "products")
public class Product {
    @Column(nullable = false)
    private String dosageForm;
    
    @Column(nullable = false)
    private Boolean isNarcotic;
    // ...
}
```

#### After - Option 1: Single Entity with Type Field
```java
@Entity
@Table(name = "products")
public class Product {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType productType;
    
    private String dosageForm;  // nullable now
    private Boolean isNarcotic;  // nullable now
    
    // New fields
    private String ingredients;
    private String allergenInfo;
    
    @Column(columnDefinition = "jsonb")
    private String nutritionalInfo;
    
    // Validation methods
    public boolean isValid() {
        if (productType == ProductType.MEDICAL) {
            return dosageForm != null && isNarcotic != null;
        }
        return true;
    }
}

public enum ProductType {
    MEDICAL, FOOD, COSMETIC, SUPPLEMENT, GENERAL
}
```

#### After - Option 2: Inheritance Hierarchy (Better OOP)
```java
@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "product_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Product {
    @Id
    private Long id;
    private String productName;
    private BigDecimal sellingPrice;
    // Common fields...
}

@Entity
@DiscriminatorValue("MEDICAL")
public class MedicalProduct extends Product {
    @Column(nullable = false)
    private String dosageForm;
    
    @Column(nullable = false)
    private Boolean isNarcotic;
    
    private String genericName;
    private String strength;
    // Medical-specific fields...
}

@Entity
@DiscriminatorValue("FOOD")
public class FoodProduct extends Product {
    private String ingredients;
    
    @Column(columnDefinition = "jsonb")
    private String nutritionalInfo;
    
    private String allergenInfo;
    private Integer shelfLifeDays;
    // Food-specific fields...
}

@Entity
@DiscriminatorValue("COSMETIC")
public class CosmeticProduct extends Product {
    private String skinType;
    private String usageInstructions;
    private String ingredients;
    // Cosmetic-specific fields...
}
```

### Repository Examples

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductType(ProductType type);
    
    @Query("SELECT p FROM Product p WHERE p.productType = :type AND p.isActive = true")
    List<Product> findActiveByType(@Param("type") ProductType type);
}

// Specific repositories if using inheritance
public interface MedicalProductRepository extends JpaRepository<MedicalProduct, Long> {
    List<MedicalProduct> findByDosageForm(String dosageForm);
    List<MedicalProduct> findByIsPrescriptionRequiredTrue();
}

public interface FoodProductRepository extends JpaRepository<FoodProduct, Long> {
    List<FoodProduct> findByShelfLifeDaysLessThan(Integer days);
}
```

---

## 🔍 Query Examples

### Basic Queries

```sql
-- Get all medical products
SELECT * FROM products WHERE product_type = 'MEDICAL' AND deleted = false;

-- Get all food products
SELECT * FROM products WHERE product_type = 'FOOD' AND deleted = false;

-- Get products by type with stock below minimum
SELECT * FROM products p
JOIN branch_inventory bi ON p.id = bi.product_id
WHERE p.product_type = 'FOOD' 
  AND bi.quantity_on_hand < bi.minimum_stock;
```

### Advanced Queries

```sql
-- Get expiring food products (using shelf_life_days)
SELECT 
    p.product_name,
    p.shelf_life_days,
    ed.expiry_date,
    ed.batch_number
FROM products p
JOIN expiry_data ed ON p.id = ed.product_id
WHERE p.product_type = 'FOOD'
  AND ed.expiry_date <= CURRENT_DATE + INTERVAL '30 days';

-- Sales report by product type
SELECT 
    p.product_type,
    COUNT(DISTINCT s.id) as total_sales,
    SUM(si.quantity) as total_quantity,
    SUM(si.total_amount) as total_revenue
FROM products p
JOIN sale_items si ON p.id = si.product_id
JOIN sales s ON si.sale_id = s.id
WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.product_type;
```

---

## 📝 Example Data Insertions

### Medical Product (Existing)
```sql
INSERT INTO products (
    created_at, created_by, deleted, last_modified_by, updated_at,
    product_type, product_code, product_name, 
    dosage_form, drug_schedule, generic_name, strength,
    is_narcotic, is_prescription_required, is_refrigerated,
    cost_price, selling_price, mrp, is_active, is_discontinued,
    minimum_stock, maximum_stock, reorder_level, gst_rate
) VALUES (
    NOW(), 'ADMIN', FALSE, 'ADMIN', NOW(),
    'MEDICAL', 'MED-001', 'Paracetamol 500mg',
    'TABLET', 'G', 'Paracetamol', '500mg',
    FALSE, FALSE, FALSE,
    2.50, 5.00, 5.00, TRUE, FALSE,
    100, 1000, 200, 12.00
);
```

### Food Product (New)
```sql
INSERT INTO products (
    created_at, created_by, deleted, last_modified_by, updated_at,
    product_type, product_code, product_name, description,
    cost_price, selling_price, mrp, is_active, is_discontinued,
    minimum_stock, maximum_stock, reorder_level, gst_rate,
    ingredients, allergen_info, shelf_life_days, country_of_origin
) VALUES (
    NOW(), 'ADMIN', FALSE, 'ADMIN', NOW(),
    'FOOD', 'FOOD-001', 'Organic Honey 500g', 'Pure natural honey',
    250.00, 350.00, 350.00, TRUE, FALSE,
    10, 100, 20, 5.00,
    'Pure Honey (100%)', 'May contain pollen traces', 730, 'India'
);
```

### Cosmetic Product (New)
```sql
INSERT INTO products (
    created_at, created_by, deleted, last_modified_by, updated_at,
    product_type, product_code, product_name, description,
    cost_price, selling_price, mrp, is_active, is_discontinued,
    minimum_stock, maximum_stock, reorder_level, gst_rate,
    skin_type, usage_instructions, ingredients
) VALUES (
    NOW(), 'ADMIN', FALSE, 'ADMIN', NOW(),
    'COSMETIC', 'COSM-001', 'Face Moisturizer 50ml', 'Daily hydration',
    300.00, 450.00, 450.00, TRUE, FALSE,
    15, 80, 25, 18.00,
    'All Skin Types', 'Apply twice daily on clean face',
    'Aqua, Glycerin, Aloe Vera Extract, Vitamin E'
);
```

---

## ⚙️ Migration Process

### Pre-Migration Checklist
- [ ] **Backup database** - Create full backup before any changes
- [ ] **Test on staging** - Never test on production first
- [ ] **Review foreign keys** - Ensure no cascading issues
- [ ] **Check application code** - Identify all product queries
- [ ] **Plan downtime** - Schedule maintenance window if needed

### Execution Steps

1. **Backup Database**
   ```bash
   pg_dump -U postgres medlan_db > backup_before_migration.sql
   ```

2. **Run Migration in Transaction**
   ```sql
   BEGIN;
   -- Run all migration steps
   -- Test queries
   -- If all good: COMMIT
   -- If issues: ROLLBACK
   ```

3. **Verify Changes**
   ```sql
   -- Check column additions
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'products';
   
   -- Test constraint
   SELECT constraint_name, constraint_type 
   FROM information_schema.table_constraints 
   WHERE table_name = 'products';
   ```

4. **Test Application**
   - Test existing product queries
   - Test new product insertions
   - Test inventory operations
   - Test sales operations

### Post-Migration Tasks

- [ ] Update application DTOs/Models
- [ ] Update validation logic
- [ ] Update UI forms for different product types
- [ ] Update reports to filter by product type
- [ ] Train staff on new product types
- [ ] Update documentation

---

## 🎨 UI Considerations

### Product Entry Form

Instead of one form, you'll want dynamic forms based on product type:

```javascript
// Pseudo-code for dynamic form
function renderProductForm(productType) {
    // Common fields (always shown)
    render(["Product Name", "Code", "Price", "Stock"]);
    
    // Type-specific fields
    switch(productType) {
        case 'MEDICAL':
            render(["Dosage Form", "Drug Schedule", "Generic Name", "Strength"]);
            break;
        case 'FOOD':
            render(["Ingredients", "Allergen Info", "Shelf Life", "Nutritional Info"]);
            break;
        case 'COSMETIC':
            render(["Skin Type", "Usage Instructions", "Ingredients"]);
            break;
    }
}
```

---

## 📈 Performance Considerations

### Indexing Strategy
```sql
-- Type-based queries
CREATE INDEX idx_products_product_type ON products(product_type);

-- Common combined queries
CREATE INDEX idx_products_active_type ON products(is_active, product_type) 
WHERE deleted = FALSE;

-- Category + type queries
CREATE INDEX idx_products_category_type ON products(category_id, product_type);
```

### Query Optimization
- Always include `product_type` in WHERE clauses when you know it
- Use views for frequently accessed product type subsets
- Consider partitioning if you have millions of products

---

## 🔒 Security & Validation

### Application-Level Validation

```java
@Service
public class ProductValidator {
    
    public void validate(Product product) {
        // Common validation
        if (product.getSellingPrice().compareTo(product.getCostPrice()) < 0) {
            throw new ValidationException("Selling price cannot be less than cost price");
        }
        
        // Type-specific validation
        if (product.getProductType() == ProductType.MEDICAL) {
            validateMedicalProduct((MedicalProduct) product);
        } else if (product.getProductType() == ProductType.FOOD) {
            validateFoodProduct((FoodProduct) product);
        }
    }
    
    private void validateMedicalProduct(MedicalProduct product) {
        if (product.getDosageForm() == null) {
            throw new ValidationException("Dosage form is required for medical products");
        }
        if (product.getIsNarcotic() == null) {
            throw new ValidationException("Narcotic flag is required for medical products");
        }
    }
    
    private void validateFoodProduct(FoodProduct product) {
        if (product.getShelfLifeDays() != null && product.getShelfLifeDays() < 0) {
            throw new ValidationException("Shelf life cannot be negative");
        }
    }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Existing Code Expects Non-Null Medical Fields

**Problem:** 
```java
// This will throw NullPointerException for food products
if (product.getIsNarcotic()) { ... }
```

**Solution:**
```java
// Safe null check
if (Boolean.TRUE.equals(product.getIsNarcotic())) { ... }

// Or type check
if (product.getProductType() == ProductType.MEDICAL && 
    Boolean.TRUE.equals(product.getIsNarcotic())) { ... }
```

### Issue 2: Reports Breaking

**Problem:** Existing reports assume all products are medical

**Solution:** Add type filters
```sql
-- Old query
SELECT * FROM products WHERE is_prescription_required = true;

-- New query
SELECT * FROM products 
WHERE product_type = 'MEDICAL' 
  AND is_prescription_required = true;
```

### Issue 3: Inventory Expiry for Non-Medical

**Problem:** Food items expire differently than medicines

**Solution:** Use `shelf_life_days` for food products
```sql
-- Calculate expiry for food products based on shelf life
SELECT 
    p.product_name,
    ib.batch_date,
    ib.batch_date + (p.shelf_life_days || ' days')::INTERVAL as expiry_date
FROM products p
JOIN inventory_batches ib ON p.id = ib.product_id
WHERE p.product_type = 'FOOD';
```

---

## 📚 Best Practices

1. **Always use product_type in queries** when filtering by type
2. **Use database views** for commonly accessed product type subsets
3. **Validate at both DB and application level**
4. **Use JSONB for flexible attributes** instead of adding too many nullable columns
5. **Keep audit logs** for product type changes
6. **Document type-specific business rules** clearly

---

## 🔄 Future Enhancements

### Easy Additions
- New product types (EQUIPMENT, BEVERAGE, etc.)
- Product bundles (multiple items sold together)
- Product variants (sizes, colors)

### Advanced Features
```sql
-- Add product bundles support
ALTER TABLE products 
ADD COLUMN is_bundle BOOLEAN DEFAULT FALSE,
ADD COLUMN bundle_items JSONB; -- [{product_id: 1, quantity: 2}, ...]

-- Add product variants support
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    parent_product_id BIGINT REFERENCES products(id),
    variant_name VARCHAR(100),
    variant_attributes JSONB -- {size: 'Large', color: 'Blue'}
);
```

---

## ✅ Testing Checklist

- [ ] Can insert medical products with all required fields
- [ ] Can insert food products without medical fields
- [ ] Can insert cosmetic products
- [ ] Medical products require dosage_form (constraint works)
- [ ] Food products can have nutritional_info
- [ ] All existing product queries still work
- [ ] Inventory operations work for all product types
- [ ] Sales work for all product types
- [ ] Reports can filter by product type
- [ ] Expiry tracking works appropriately

---

## 📞 Support & Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Database migration best practices
- Your internal documentation

---

**Last Updated:** February 2026  
**Version:** 1.0
