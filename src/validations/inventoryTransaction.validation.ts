import { z } from "zod";

export const createTransactionSchema = z.object({
  ingredientId: z.string().uuid("Invalid ingredient ID"),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  reference: z.enum(["ORDER", "MANUAL", "RESTOCK"]),
  orderId: z.string().uuid("Invalid order ID").optional(),
});

export const transactionFilterSchema = z.object({
  ingredientId: z.string().uuid("Invalid ingredient ID").optional(),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionFilter = z.infer<typeof transactionFilterSchema>;
