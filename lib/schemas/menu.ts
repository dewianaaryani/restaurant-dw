import { z } from "zod";

export const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  desc: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url().optional(),
  category_id: z.string().min(1, "Category is required"),
  is_available: z.boolean().default(true),
});

export type MenuItem = z.infer<typeof menuItemSchema>;
