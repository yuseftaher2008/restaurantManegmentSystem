import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

export const createPaymentSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  method: z.enum(["CASH", "CARD", "WALLET"]),
  transactionReference: z.string().min(1, "Transaction reference is required").max(255),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PAID", "FAILED", "REFUNDED"]),
});

export const paymentOrderParamsSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type PaymentOrderParams = z.infer<typeof paymentOrderParamsSchema>;
