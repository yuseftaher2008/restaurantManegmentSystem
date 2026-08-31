import { z } from "zod";
import { uuidParamsSchema } from "./common.validation";

export const createOrderSchema = z.object({
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export const orderParamsSchema = uuidParamsSchema;

export const orderFilterSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderParams = z.infer<typeof orderParamsSchema>;
export type OrderFilter = z.infer<typeof orderFilterSchema>;
