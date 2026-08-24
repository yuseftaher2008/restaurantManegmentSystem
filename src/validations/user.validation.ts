import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

export { uuidParamsSchema };

// Helper to strip HTML tags for XSS prevention
const stripHtml = (val: string) => val.replace(/<[^>]*>/g, "").trim();

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name must be at most 25 characters")
    .transform(stripHtml),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name must be at most 25 characters")
    .transform(stripHtml),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});


export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(25, "First name must be at most 25 characters")
      .optional()
      .transform((val) => (val ? stripHtml(val) : val)),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(25, "Last name must be at most 25 characters")
      .optional()
      .transform((val) => (val ? stripHtml(val) : val)),
    email: z.string().email("Invalid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    currentPassword: z.string().min(1, "Current password is required").optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.currentPassword) return false;
      return true;
    },
    {
      message: "Current password is required when changing password",
      path: ["currentPassword"],
    }
  );

export const deleteUserParamsSchema = uuidParamsSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
