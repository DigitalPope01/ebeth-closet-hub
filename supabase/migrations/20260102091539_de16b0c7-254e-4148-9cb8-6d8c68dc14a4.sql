-- Add barcode column to products table for standard barcode formats
ALTER TABLE public.products ADD COLUMN barcode TEXT;

-- Create index for fast barcode lookups
CREATE INDEX idx_products_barcode ON public.products(barcode);