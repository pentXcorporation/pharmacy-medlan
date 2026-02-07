-- =====================================================
-- PRODUCT REFACTORING MIGRATION SCRIPT
-- Multi-Product Type Support for Pharmacy Management
-- =====================================================
-- This script migrates the products table from medical-only
-- to support 10 different product types using Single Table Inheritance

-- BACKUP RECOMMENDATION: Create full database backup before running this script

BEGIN;

-- =====================================================
-- STEP 1: ADD DISCRIMINATOR COLUMN
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);

-- Set default value for existing products (all are medical)
UPDATE products 
SET product_type = 'MEDICAL' 
WHERE product_type IS NULL;

-- Make product_type NOT NULL after backfilling
ALTER TABLE products 
ALTER COLUMN product_type SET NOT NULL;

-- =====================================================
-- STEP 2: MAKE MEDICAL-SPECIFIC FIELDS NULLABLE
-- =====================================================
-- These fields are required for medical products but optional for others

ALTER TABLE products 
ALTER COLUMN is_prescription_required DROP NOT NULL;

ALTER TABLE products 
ALTER COLUMN is_narcotic DROP NOT NULL;

ALTER TABLE products 
ALTER COLUMN is_refrigerated DROP NOT NULL;

ALTER TABLE products 
ALTER COLUMN dosage_form DROP NOT NULL;

ALTER TABLE products 
ALTER COLUMN drug_schedule DROP NOT NULL;

-- =====================================================
-- STEP 3: ADD COMMON ADDITIONAL FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS country_of_origin VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS package_dimensions VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight_grams INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_attributes TEXT;

-- =====================================================
-- STEP 4: ADD SUPPLEMENT-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS supplement_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS active_ingredients TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dosage_instructions TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS serving_size VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS servings_per_container INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS age_group VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS warnings TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_fda_approved BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_certified_organic BOOLEAN;

-- =====================================================
-- STEP 5: ADD FOOD-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS ingredients TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS nutritional_info TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS allergen_info TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS shelf_life_days INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_organic BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS fssai_license VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS food_category VARCHAR(100);

-- =====================================================
-- STEP 6: ADD BABY CARE-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS age_range VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_sub_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size VARCHAR(50);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_hypoallergenic BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_dermatologically_tested BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_fragrance_free BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS pack_quantity INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS usage_instructions TEXT;

-- =====================================================
-- STEP 7: ADD COSMETIC-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS skin_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dermatologically_tested BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_paraben_free BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_cruelty_free BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS spf_rating INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS fragrance_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS expiry_months_after_opening INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cosmetic_category VARCHAR(100);

-- =====================================================
-- STEP 8: ADD MEDICAL EQUIPMENT-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS equipment_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS warranty_months INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS requires_calibration BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS calibration_frequency_days INTEGER;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS power_source VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS specifications TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS brand_model VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_certified BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS certification_number VARCHAR(100);

-- =====================================================
-- STEP 9: ADD SURGICAL-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sterilized BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS single_use BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS material VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_latex_free BOOLEAN;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sterilization_method VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS surgical_category VARCHAR(100);

-- =====================================================
-- STEP 10: ADD AYURVEDIC-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS ayurvedic_type VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS ayush_license VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS contraindications TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS therapeutic_uses TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS preparation_method VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_classical_formulation BOOLEAN;

-- =====================================================
-- STEP 11: ADD HOMEOPATHIC-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS potency VARCHAR(50);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS mother_tincture VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS indications TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS form VARCHAR(100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS homeopathic_pharmacopoeia VARCHAR(200);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_combination_remedy BOOLEAN;

-- =====================================================
-- STEP 12: ADD GENERAL-SPECIFIC FIELDS
-- =====================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_category VARCHAR(100);

-- =====================================================
-- STEP 13: ADD CONDITIONAL CHECK CONSTRAINTS
-- =====================================================
-- These ensure data integrity based on product type

-- Medical products must have dosage_form and drug_schedule
ALTER TABLE products 
ADD CONSTRAINT check_medical_fields 
CHECK (
    product_type != 'MEDICAL' OR (
        dosage_form IS NOT NULL AND 
        drug_schedule IS NOT NULL AND
        is_prescription_required IS NOT NULL AND
        is_narcotic IS NOT NULL AND
        is_refrigerated IS NOT NULL
    )
);

-- Food products must have FSSAI license and shelf life
ALTER TABLE products 
ADD CONSTRAINT check_food_fields 
CHECK (
    product_type != 'FOOD' OR (
        fssai_license IS NOT NULL AND 
        shelf_life_days IS NOT NULL
    )
);

-- Ayurvedic products must have AYUSH license
ALTER TABLE products 
ADD CONSTRAINT check_ayurvedic_fields 
CHECK (
    product_type != 'AYURVEDIC' OR (
        ayush_license IS NOT NULL AND
        ayurvedic_type IS NOT NULL
    )
);

-- Surgical products must specify sterilization and usage type
ALTER TABLE products 
ADD CONSTRAINT check_surgical_fields 
CHECK (
    product_type != 'SURGICAL' OR (
        sterilized IS NOT NULL AND
        single_use IS NOT NULL
    )
);

-- Homeopathic products must have potency or be mother tincture
ALTER TABLE products 
ADD CONSTRAINT check_homeopathic_fields 
CHECK (
    product_type != 'HOMEOPATHIC' OR (
        (form = 'Mother Tincture' AND mother_tincture IS NOT NULL) OR
        (form != 'Mother Tincture' AND potency IS NOT NULL)
    )
);

-- =====================================================
-- STEP 14: CREATE PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_product_type 
ON products(product_type);

CREATE INDEX IF NOT EXISTS idx_product_type_active 
ON products(product_type, is_active) 
WHERE deleted = false;

CREATE INDEX IF NOT EXISTS idx_product_type_category 
ON products(product_type, category_id) 
WHERE deleted = false;

-- =====================================================
-- STEP 15: CREATE TYPE-SPECIFIC VIEWS (OPTIONAL)
-- =====================================================
-- These views make querying specific product types easier

CREATE OR REPLACE VIEW medical_products AS
SELECT * FROM products WHERE product_type = 'MEDICAL' AND deleted = false;

CREATE OR REPLACE VIEW supplement_products AS
SELECT * FROM products WHERE product_type = 'SUPPLEMENT' AND deleted = false;

CREATE OR REPLACE VIEW food_products AS
SELECT * FROM products WHERE product_type = 'FOOD' AND deleted = false;

CREATE OR REPLACE VIEW baby_care_products AS
SELECT * FROM products WHERE product_type = 'BABY_CARE' AND deleted = false;

CREATE OR REPLACE VIEW cosmetic_products AS
SELECT * FROM products WHERE product_type = 'COSMETIC' AND deleted = false;

CREATE OR REPLACE VIEW medical_equipment_products AS
SELECT * FROM products WHERE product_type = 'MEDICAL_EQUIPMENT' AND deleted = false;

CREATE OR REPLACE VIEW surgical_products AS
SELECT * FROM products WHERE product_type = 'SURGICAL' AND deleted = false;

CREATE OR REPLACE VIEW ayurvedic_products AS
SELECT * FROM products WHERE product_type = 'AYURVEDIC' AND deleted = false;

CREATE OR REPLACE VIEW homeopathic_products AS
SELECT * FROM products WHERE product_type = 'HOMEOPATHIC' AND deleted = false;

CREATE OR REPLACE VIEW general_products AS
SELECT * FROM products WHERE product_type = 'GENERAL' AND deleted = false;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after migration to verify success

-- Check product type distribution
-- SELECT product_type, COUNT(*) as count FROM products GROUP BY product_type;

-- Check for NULL product_type (should be 0)
-- SELECT COUNT(*) FROM products WHERE product_type IS NULL;

-- Check medical products have required fields
-- SELECT COUNT(*) FROM products 
-- WHERE product_type = 'MEDICAL' 
-- AND (dosage_form IS NULL OR drug_schedule IS NULL);

COMMIT;

-- =====================================================
-- ROLLBACK SCRIPT (in case of issues)
-- =====================================================
/*
BEGIN;

-- Drop views
DROP VIEW IF EXISTS medical_products CASCADE;
DROP VIEW IF EXISTS supplement_products CASCADE;
DROP VIEW IF EXISTS food_products CASCADE;
DROP VIEW IF EXISTS baby_care_products CASCADE;
DROP VIEW IF EXISTS cosmetic_products CASCADE;
DROP VIEW IF EXISTS medical_equipment_products CASCADE;
DROP VIEW IF EXISTS surgical_products CASCADE;
DROP VIEW IF EXISTS ayurvedic_products CASCADE;
DROP VIEW IF EXISTS homeopathic_products CASCADE;
DROP VIEW IF EXISTS general_products CASCADE;

-- Drop constraints
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_medical_fields;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_food_fields;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_ayurvedic_fields;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_surgical_fields;
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_homeopathic_fields;

-- Drop indexes
DROP INDEX IF EXISTS idx_product_type;
DROP INDEX IF EXISTS idx_product_type_active;
DROP INDEX IF EXISTS idx_product_type_category;

-- Remove new columns (use carefully - data will be lost!)
-- ALTER TABLE products DROP COLUMN IF EXISTS product_type;
-- ... (drop other columns as needed)

COMMIT;
*/
