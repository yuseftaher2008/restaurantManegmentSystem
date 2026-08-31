import { prisma } from "../../lib/prisma";
import type { Order } from "../../generated/prisma/client";
import type { OrderUncheckedCreateInput, OrderUpdateInput } from "../../generated/prisma/models/Order";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<Order, OrderUncheckedCreateInput, OrderUpdateInput> {

    constructor() {
        super(prisma.order);
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOrderWithItems(orderId: string) {
        return prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: { menuItem: true },
                },
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
        });
    }

    async findAllWithUser(status?: string): Promise<Order[]> {
        const where = status ? { status: status as any } : {};
        return prisma.order.findMany({
            where,
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}
