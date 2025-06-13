import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  desc: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;
