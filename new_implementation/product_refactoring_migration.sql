-- ============================================================================
-- PHARMACY MANAGEMENT SYSTEM - PRODUCT TABLE REFACTORING
-- Migration to support Medical and Non-Medical Products
-- ============================================================================

-- STEP 1: Add product_type column
-- ============================================================================
ALTER TABLE public.products 
ADD COLUMN product_type VARCHAR(50) NOT NULL DEFAULT 'MEDICAL';

ALTER TABLE public.products
ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('MEDICAL', 'FOOD', 'COSMETIC', 'SUPPLEMENT', 'GENERAL'));

-- Create index for better query performance
CREATE INDEX idx_products_product_type ON public.products(product_type);

COMMENT ON COLUMN public.products.product_type IS 'Type of product: MEDICAL, FOOD, COSMETIC, SUPPLEMENT, GENERAL';


-- STEP 2: Make medical-specific fields nullable
-- ============================================================================

-- Remove NOT NULL constraints from medical-specific boolean fields
ALTER TABLE public.products 
ALTER COLUMN is_narcotic DROP NOT NULL,
ALTER COLUMN is_prescription_required DROP NOT NULL,
ALTER COLUMN is_refrigerated DROP NOT NULL;

-- Set default values for existing data
UPDATE public.products 
SET is_narcotic = FALSE WHERE is_narcotic IS NULL;

UPDATE public.products 
SET is_prescription_required = FALSE WHERE is_prescription_required IS NULL;

UPDATE public.products 
SET is_refrigerated = FALSE WHERE is_refrigerated IS NULL;

-- Modify CHECK constraint for dosage_form to allow NULL
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_dosage_form_check;

ALTER TABLE public.products 
ADD CONSTRAINT products_dosage_form_check 
CHECK (
  dosage_form IS NULL OR 
  dosage_form IN (
    'TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'DROPS', 
    'CREAM', 'OINTMENT', 'INHALER', 'POWDER', 'SUSPENSION', 
    'GEL', 'LOTION', 'SPRAY', 'PATCH', 'SUPPOSITORY'
  )
);

-- Modify CHECK constraint for drug_schedule to allow NULL
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_drug_schedule_check;

ALTER TABLE public.products 
ADD CONSTRAINT products_drug_schedule_check 
CHECK (
  drug_schedule IS NULL OR 
  drug_schedule IN ('H', 'H1', 'X', 'G', 'C', 'C1')
);


-- STEP 3: Add validation constraint to ensure medical products have required fields
-- ============================================================================
ALTER TABLE public.products 
ADD CONSTRAINT products_medical_fields_check 
CHECK (
  -- If product is MEDICAL, certain fields should be populated
  (product_type != 'MEDICAL') OR 
  (
    product_type = 'MEDICAL' AND 
    dosage_form IS NOT NULL AND
    is_prescription_required IS NOT NULL AND
    is_narcotic IS NOT NULL
  )
);

COMMENT ON CONSTRAINT products_medical_fields_check ON public.products IS 
'Ensures medical products have required medical-specific fields populated';


-- STEP 4: Add optional fields for non-medical products
-- ============================================================================

-- Add fields useful for food products
ALTER TABLE public.products 
ADD COLUMN ingredients TEXT,
ADD COLUMN nutritional_info JSONB,
ADD COLUMN allergen_info TEXT,
ADD COLUMN shelf_life_days INTEGER;

-- Add fields useful for cosmetics
ALTER TABLE public.products 
ADD COLUMN skin_type VARCHAR(100),
ADD COLUMN usage_instructions TEXT;

-- Add common fields
ALTER TABLE public.products 
ADD COLUMN country_of_origin VARCHAR(100),
ADD COLUMN package_dimensions VARCHAR(100),
ADD COLUMN weight_grams NUMERIC(10,2);

-- Add metadata field for flexible attributes
ALTER TABLE public.products 
ADD COLUMN additional_attributes JSONB;

COMMENT ON COLUMN public.products.ingredients IS 'Ingredient list for food/cosmetic products';
COMMENT ON COLUMN public.products.nutritional_info IS 'Nutritional information in JSON format for food products';
COMMENT ON COLUMN public.products.allergen_info IS 'Allergen information for food products';
COMMENT ON COLUMN public.products.shelf_life_days IS 'Shelf life in days for food/perishable products';
COMMENT ON COLUMN public.products.skin_type IS 'Recommended skin type for cosmetic products';
COMMENT ON COLUMN public.products.usage_instructions IS 'Detailed usage instructions';
COMMENT ON COLUMN public.products.additional_attributes IS 'Flexible JSON field for product-type specific attributes';


-- STEP 5: Create views for different product types (optional but recommended)
-- ============================================================================

-- View for medical products only
CREATE OR REPLACE VIEW v_medical_products AS
SELECT 
  id, version, created_at, created_by, deleted, deleted_at, deleted_by,
  last_modified_by, updated_at, product_type, barcode, cost_price, description,
  dosage_form, drug_schedule, generic_name, gst_rate, is_active, is_discontinued,
  is_narcotic, is_prescription_required, is_refrigerated, manufacturer,
  maximum_stock, minimum_stock, mrp, product_code, product_name, profit_margin,
  reorder_level, selling_price, strength, supplier, category_id, 
  sub_category_id, tax_category_id, unit_id
FROM public.products
WHERE product_type = 'MEDICAL' AND deleted = FALSE;

COMMENT ON VIEW v_medical_products IS 'View of medical products only';

-- View for food products only
CREATE OR REPLACE VIEW v_food_products AS
SELECT 
  id, version, created_at, created_by, deleted, deleted_at, deleted_by,
  last_modified_by, updated_at, product_type, barcode, cost_price, description,
  gst_rate, is_active, is_discontinued, manufacturer, maximum_stock, 
  minimum_stock, mrp, product_code, product_name, profit_margin, reorder_level,
  selling_price, supplier, category_id, sub_category_id, tax_category_id, unit_id,
  ingredients, nutritional_info, allergen_info, shelf_life_days,
  country_of_origin, package_dimensions, weight_grams, additional_attributes
FROM public.products
WHERE product_type = 'FOOD' AND deleted = FALSE;

COMMENT ON VIEW v_food_products IS 'View of food products only';

-- View for cosmetic products only
CREATE OR REPLACE VIEW v_cosmetic_products AS
SELECT 
  id, version, created_at, created_by, deleted, deleted_at, deleted_by,
  last_modified_by, updated_at, product_type, barcode, cost_price, description,
  gst_rate, is_active, is_discontinued, manufacturer, maximum_stock, 
  minimum_stock, mrp, product_code, product_name, profit_margin, reorder_level,
  selling_price, supplier, category_id, sub_category_id, tax_category_id, unit_id,
  skin_type, usage_instructions, ingredients, country_of_origin, 
  package_dimensions, weight_grams, additional_attributes
FROM public.products
WHERE product_type = 'COSMETIC' AND deleted = FALSE;

COMMENT ON VIEW v_cosmetic_products IS 'View of cosmetic products only';


-- STEP 6: Update existing data
-- ============================================================================

-- Mark all existing products as MEDICAL type (they already are)
UPDATE public.products 
SET product_type = 'MEDICAL' 
WHERE product_type IS NULL;


-- STEP 7: Example data for testing new product types
-- ============================================================================

-- Example: Insert a food product
/*
INSERT INTO public.products (
  created_at, created_by, deleted, last_modified_by, updated_at,
  product_type, product_code, product_name, description,
  cost_price, selling_price, mrp, is_active, is_discontinued,
  minimum_stock, maximum_stock, reorder_level, gst_rate,
  ingredients, allergen_info, shelf_life_days, category_id, unit_id
) VALUES (
  NOW(), 'SYSTEM', FALSE, 'SYSTEM', NOW(),
  'FOOD', 'FOOD-001', 'Organic Honey', 'Pure organic honey 500g',
  250.00, 350.00, 350.00, TRUE, FALSE,
  10, 100, 20, 5.00,
  'Pure Honey, Natural', 'May contain traces of pollen', 730, 1, 1
);
*/

-- Example: Insert a cosmetic product
/*
INSERT INTO public.products (
  created_at, created_by, deleted, last_modified_by, updated_at,
  product_type, product_code, product_name, description,
  cost_price, selling_price, mrp, is_active, is_discontinued,
  minimum_stock, maximum_stock, reorder_level, gst_rate,
  skin_type, usage_instructions, ingredients, category_id, unit_id
) VALUES (
  NOW(), 'SYSTEM', FALSE, 'SYSTEM', NOW(),
  'COSMETIC', 'COSM-001', 'Moisturizing Face Cream', 'Daily moisturizer 50ml',
  300.00, 450.00, 450.00, TRUE, FALSE,
  15, 80, 25, 18.00,
  'All skin types', 'Apply twice daily on clean face',
  'Aqua, Glycerin, Aloe Vera, Vitamin E', 1, 1
);
*/


-- STEP 8: Create indexes for better performance
-- ============================================================================

CREATE INDEX idx_products_active_type ON public.products(is_active, product_type) 
WHERE deleted = FALSE;

CREATE INDEX idx_products_category_type ON public.products(category_id, product_type) 
WHERE deleted = FALSE;


-- STEP 9: Grant permissions (adjust as needed for your application user)
-- ============================================================================

-- GRANT SELECT, INSERT, UPDATE ON public.products TO your_app_user;
-- GRANT SELECT ON v_medical_products TO your_app_user;
-- GRANT SELECT ON v_food_products TO your_app_user;
-- GRANT SELECT ON v_cosmetic_products TO your_app_user;


-- ============================================================================
-- ROLLBACK SCRIPT (In case you need to revert)
-- ============================================================================

/*
-- Remove new columns
ALTER TABLE public.products 
DROP COLUMN IF EXISTS product_type,
DROP COLUMN IF EXISTS ingredients,
DROP COLUMN IF EXISTS nutritional_info,
DROP COLUMN IF EXISTS allergen_info,
DROP COLUMN IF EXISTS shelf_life_days,
DROP COLUMN IF EXISTS skin_type,
DROP COLUMN IF EXISTS usage_instructions,
DROP COLUMN IF EXISTS country_of_origin,
DROP COLUMN IF EXISTS package_dimensions,
DROP COLUMN IF EXISTS weight_grams,
DROP COLUMN IF EXISTS additional_attributes;

-- Restore NOT NULL constraints
ALTER TABLE public.products 
ALTER COLUMN is_narcotic SET NOT NULL,
ALTER COLUMN is_prescription_required SET NOT NULL,
ALTER COLUMN is_refrigerated SET NOT NULL;

-- Drop views
DROP VIEW IF EXISTS v_medical_products;
DROP VIEW IF EXISTS v_food_products;
DROP VIEW IF EXISTS v_cosmetic_products;

-- Drop indexes
DROP INDEX IF EXISTS idx_products_product_type;
DROP INDEX IF EXISTS idx_products_active_type;
DROP INDEX IF EXISTS idx_products_category_type;
*/
