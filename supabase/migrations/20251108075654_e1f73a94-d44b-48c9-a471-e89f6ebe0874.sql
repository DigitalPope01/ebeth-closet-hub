-- Enable realtime for orders table with full row data
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add the orders table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Add tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT;