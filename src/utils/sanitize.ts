import { z } from "zod";

/**
 * Sanitize user input for use in database text search (ilike).
 * Escapes special Postgres pattern chars and limits length.
 */
export function sanitizeSearchQuery(input: string, maxLength = 100): string {
  return input
    .slice(0, maxLength)
    .replace(/[%_\\]/g, (char) => `\\${char}`)
    .trim();
}

/**
 * Validate a UUID string format.
 */
export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// Profile form validation schema
export const profileSchema = z.object({
  full_name: z.string().trim().max(100, "Name must be less than 100 characters").nullable().optional(),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters")
    .regex(/^[+\d\s\-()]*$/, "Invalid phone number format")
    .nullable().optional(),
  address: z.string().trim().max(500, "Address must be less than 500 characters").nullable().optional(),
  city: z.string().trim().max(100, "City must be less than 100 characters").nullable().optional(),
  state: z.string().trim().max(100, "State must be less than 100 characters").nullable().optional(),
  postal_code: z.string().trim().max(20, "Postal code must be less than 20 characters")
    .regex(/^[a-zA-Z0-9\s\-]*$/, "Invalid postal code format")
    .nullable().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
