import { prisma } from "../../lib/prisma";
import type { OrderItem } from "../../generated/prisma/client";
import type { OrderItemUncheckedCreateInput, OrderItemUpdateInput } from "../../generated/prisma/models/OrderItem";
import { BaseRepository } from "./base.repository";

export class OrderItemRepository extends BaseRepository<OrderItem, OrderItemUncheckedCreateInput, OrderItemUpdateInput> {

    constructor() {
        super(prisma.orderItem);
    }

    async findByOrderId(orderId: string): Promise<OrderItem[]> {
        return prisma.orderItem.findMany({
            where: { orderId },
            include: { menuItem: true },
        });
    }
}
