import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

// [L-6] Helper to strip HTML tags for XSS prevention
const stripHtml = (val: string) => val.replace(/<[^>]*>/g, "").trim();


export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be at most 255 characters")
    .transform(stripHtml),
});


export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be at most 255 characters")
    .optional()
    .transform((val) => (val ? stripHtml(val) : val)),
});

export const categoryParamsSchema = uuidParamsSchema;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
