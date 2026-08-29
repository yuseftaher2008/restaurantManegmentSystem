import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

export const createMenuItemIngredientSchema = z.object({
  menuItemId: z.string().uuid("Invalid menu item ID"),
  ingredientId: z.string().uuid("Invalid ingredient ID"),
  quantityRequired: z
    .number()
    .int("Quantity required must be an integer")
    .min(1, "Quantity required must be at least 1"),
});

export const updateMenuItemIngredientSchema = z.object({
  quantityRequired: z
    .number()
    .int("Quantity required must be an integer")
    .min(1, "Quantity required must be at least 1")
    .optional(),
});

export const menuItemIngredientParamsSchema = uuidParamsSchema;

export const menuItemIdParamsSchema = z.object({
  menuItemId: z.string().uuid("Invalid menu item ID"),
});

export type CreateMenuItemIngredientInput = z.infer<typeof createMenuItemIngredientSchema>;
export type UpdateMenuItemIngredientInput = z.infer<typeof updateMenuItemIngredientSchema>;
export type MenuItemIngredientParams = z.infer<typeof menuItemIngredientParamsSchema>;
export type MenuItemIdParams = z.infer<typeof menuItemIdParamsSchema>;
