import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

const stripHtml = (val: string) => val.replace(/<[^>]*>/g, "").trim();

export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z
    .string()
    .min(1, "Menu item name is required")
    .max(255, "Menu item name must be at most 255 characters")
    .transform(stripHtml),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required").transform(stripHtml),
  image: z.string().url("Invalid URL").optional(),
});

export const updateMenuItemSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
  name: z
    .string()
    .min(1, "Menu item name is required")
    .max(255, "Menu item name must be at most 255 characters")
    .optional()
    .transform((val) => (val ? stripHtml(val) : val)),
  price: z.number().positive("Price must be greater than 0").optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .optional()
    .transform((val) => (val ? stripHtml(val) : val)),
  image: z.string().url("Invalid URL").optional(),
});

export const menuItemParamsSchema = uuidParamsSchema;

export const menuFilterSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuItemParams = z.infer<typeof menuItemParamsSchema>;
export type MenuFilter = z.infer<typeof menuFilterSchema>;
