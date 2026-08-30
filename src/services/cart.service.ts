import { CartRepository } from "../repositories/cart.repository";
import { CartItemRepository } from "../repositories/cartItem.repository";
import { MenuItemRepository } from "../repositories/menuItem.repository";

export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private cartItemRepository: CartItemRepository,
        private menuItemRepository: MenuItemRepository
    ) {}

    async getCart(userId: string) {
        let cart = await this.cartRepository.findWithItemsByUserId(userId);
        if (!cart) {
            await this.cartRepository.create({ userId });
            cart = await this.cartRepository.findWithItemsByUserId(userId);
        }
        return cart!;
    }

    async addItem(userId: string, menuItemId: string, quantity: number) {
        const menuItem = await this.menuItemRepository.findById(menuItemId);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            cart = await this.cartRepository.create({ userId });
        }

        const existingItem = await this.cartItemRepository.findByCartIdAndMenuItemId(cart.id, menuItemId);
        if (existingItem) {
            await this.cartItemRepository.update(existingItem.id, {
                quantity: existingItem.quantity + quantity,
            });
        } else {
            await this.cartItemRepository.create({
                cartId: cart.id,
                menuItemId,
                quantity,
            });
        }

        return this.getCart(userId);
    }

    async updateItemQuantity(cartItemId: string, quantity: number, userId: string) {
        const cartItem = await this.cartItemRepository.findById(cartItemId);
        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart || cart.id !== cartItem.cartId) {
            throw new Error("Cart item not found");
        }

        await this.cartItemRepository.update(cartItemId, { quantity });
        return this.getCart(userId);
    }

    async removeItem(cartItemId: string, userId: string) {
        const cartItem = await this.cartItemRepository.findById(cartItemId);
        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart || cart.id !== cartItem.cartId) {
            throw new Error("Cart item not found");
        }

        await this.cartItemRepository.delete(cartItemId);
        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        await this.cartItemRepository.deleteByCartId(cart.id);
        return this.getCart(userId);
    }
}
