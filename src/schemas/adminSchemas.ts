import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  price: z.number()
    .positive("Price must be greater than 0")
    .max(100000000, "Price cannot exceed 100,000,000"),
  original_price: z.number()
    .positive("Original price must be greater than 0")
    .max(100000000, "Original price cannot exceed 100,000,000")
    .optional()
    .nullable(),
  stock_quantity: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock cannot exceed 999,999"),
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .nullable(),
  subcategory: z.string()
    .trim()
    .max(100, "Subcategory must be less than 100 characters")
    .optional()
    .nullable(),
  category_id: z.string().uuid("Invalid category ID"),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Order status validation schema
export const orderStatusSchema = z.enum([
  'pending',
  'processing', 
  'shipped',
  'delivered',
  'cancelled'
]);

// User role validation schema
export const userRoleSchema = z.enum([
  'user',
  'admin',
  'super_admin'
]);
