import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2).max(100),

  description: z.string().optional(),

  logo: z.string().url().optional(),

  website: z.string().url().optional(),

  email: z.email().optional(),

  phone: z.string().optional(),

  country: z.string().optional(),
});

export type BrandSchema = z.infer<
  typeof brandSchema
>;