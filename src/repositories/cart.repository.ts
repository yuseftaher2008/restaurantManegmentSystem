import { prisma } from "../../lib/prisma";
import type { Cart } from "../../generated/prisma/client";
import type { CartUncheckedCreateInput, CartUpdateInput } from "../../generated/prisma/models/Cart";
import { BaseRepository } from "./base.repository";

export class CartRepository extends BaseRepository<Cart, CartUncheckedCreateInput, CartUpdateInput> {

    constructor() {
        super(prisma.cart);
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        return prisma.cart.findUnique({
            where: { userId },
        });
    }

    async findWithItemsByUserId(userId: string) {
        return prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { menuItem: true },
                },
            },
        });
    }
}
