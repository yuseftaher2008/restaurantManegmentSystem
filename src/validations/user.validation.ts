import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name must be at most 25 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name must be at most 25 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name must be at most 25 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(25, "Last name must be at most 25 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export const uuidParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const deleteUserParamsSchema = uuidParamsSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UuidParams = z.infer<typeof uuidParamsSchema>;
export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
