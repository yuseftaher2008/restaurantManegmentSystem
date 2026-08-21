import { z } from "zod";

export const uuidParamsSchema = z.object({
  id: z.string().uuid("Invalid UUID"),
});

export type UuidParams = z.infer<typeof uuidParamsSchema>;
