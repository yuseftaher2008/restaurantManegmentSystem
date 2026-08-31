import { prisma } from "../../lib/prisma";
import type { InventoryTransaction } from "../../generated/prisma/client";
import type { InventoryTransactionUncheckedCreateInput, InventoryTransactionUpdateInput } from "../../generated/prisma/models/InventoryTransaction";
import { BaseRepository } from "./base.repository";

export class InventoryTransactionRepository extends BaseRepository<InventoryTransaction, InventoryTransactionUncheckedCreateInput, InventoryTransactionUpdateInput> {

    constructor() {
        super(prisma.inventoryTransaction);
    }

    async findByIngredientId(ingredientId: string): Promise<InventoryTransaction[]> {
        return prisma.inventoryTransaction.findMany({
            where: { ingredientId },
            include: { ingredient: true },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByOrderId(orderId: string): Promise<InventoryTransaction[]> {
        return prisma.inventoryTransaction.findMany({
            where: { orderId },
            include: { ingredient: true },
        });
    }
}
