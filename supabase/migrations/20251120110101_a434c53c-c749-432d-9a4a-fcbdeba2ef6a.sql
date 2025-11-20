-- Add attributes column to products table for storing size, color, brand, material, etc.
ALTER TABLE public.products
ADD COLUMN attributes JSONB DEFAULT '{}'::jsonb;

-- Create an index on attributes for better query performance
CREATE INDEX idx_products_attributes ON public.products USING gin(attributes);

-- Add comment to explain the attributes structure
COMMENT ON COLUMN public.products.attributes IS 'Store product attributes like size, color, brand, material as JSON. Example: {"size": ["S", "M", "L"], "color": ["Red", "Blue"], "brand": "Nike", "material": "Cotton"}';