import { prisma } from "../../lib/prisma";
import type { CartItem } from "../../generated/prisma/client";
import type { CartItemUncheckedCreateInput, CartItemUpdateInput } from "../../generated/prisma/models/CartItem";
import { BaseRepository } from "./base.repository";

export class CartItemRepository extends BaseRepository<CartItem, CartItemUncheckedCreateInput, CartItemUpdateInput> {

    constructor() {
        super(prisma.cartItem);
    }

    async findByCartIdAndMenuItemId(cartId: string, menuItemId: string): Promise<CartItem | null> {
        return prisma.cartItem.findFirst({
            where: { cartId, menuItemId },
        });
    }

    async deleteByCartId(cartId: string): Promise<void> {
        await prisma.cartItem.deleteMany({
            where: { cartId },
        });
    }
}
