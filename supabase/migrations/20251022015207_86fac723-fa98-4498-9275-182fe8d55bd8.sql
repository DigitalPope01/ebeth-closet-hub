-- Add subcategory field to products table
ALTER TABLE products ADD COLUMN subcategory TEXT;

-- Create index for better query performance
CREATE INDEX idx_products_subcategory ON products(subcategory);

-- Add comment for documentation
COMMENT ON COLUMN products.subcategory IS 'Subcategory for more specific product classification (e.g., belts, watches, shoes)';