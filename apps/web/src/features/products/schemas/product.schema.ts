import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters.")
    .max(200, "Product name cannot exceed 200 characters."),

  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(200, "Slug cannot exceed 200 characters.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may only contain lowercase letters, numbers, and hyphens."
    ),

  sku: z
    .string()
    .trim()
    .min(3, "SKU must be at least 3 characters.")
    .max(50, "SKU cannot exceed 50 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),

  shortDescription: z
    .string()
    .trim()
    .max(300, "Short description cannot exceed 300 characters.")
    .optional()
    .or(z.literal("")),

  price: z
    .number()
    .nonnegative("Price cannot be negative."),

  quantity: z
    .number()
    .int("Quantity must be an integer.")
    .nonnegative("Quantity cannot be negative."),

  categoryId: z
    .string()
    .min(1, "Category is required."),

  featured: z.boolean(),

  status: z.enum([
    "DRAFT",
    "ACTIVE",
    "OUT_OF_STOCK",
    "ARCHIVED",
  ]),
});

export type ProductSchema = z.infer<typeof productSchema>;
