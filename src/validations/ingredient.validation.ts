import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

const stripHtml = (val: string) => val.replace(/<[^>]*>/g, "").trim();

export const createIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(255, "Ingredient name must be at most 255 characters")
    .transform(stripHtml),
  unit: z.enum(["KG", "G", "L", "ML", "PIECE"], "Unit must be one of: KG, G, L, ML, PIECE"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity must be non-negative"),
  minimumQuantity: z
    .number()
    .int("Minimum quantity must be an integer")
    .min(0, "Minimum quantity must be non-negative"),
});

export const updateIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(255, "Ingredient name must be at most 255 characters")
    .optional()
    .transform((val) => (val ? stripHtml(val) : val)),
  unit: z
    .enum(["KG", "G", "L", "ML", "PIECE"], "Unit must be one of: KG, G, L, ML, PIECE")
    .optional(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity must be non-negative")
    .optional(),
  minimumQuantity: z
    .number()
    .int("Minimum quantity must be an integer")
    .min(0, "Minimum quantity must be non-negative")
    .optional(),
});

export const ingredientParamsSchema = uuidParamsSchema;

export const ingredientFilterSchema = z.object({
  lowStock: z.enum(["true", "false"]).optional(),
  unit: z.enum(["KG", "G", "L", "ML", "PIECE"]).optional(),
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type IngredientParams = z.infer<typeof ingredientParamsSchema>;
export type IngredientFilter = z.infer<typeof ingredientFilterSchema>;
