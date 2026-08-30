import type { Request, Response } from "express";
import type { CartService } from "../services/cart.service";
import type { AddToCartInput, UpdateCartItemInput } from "../validations/cart.validation";

export class CartController {
    constructor(private cartService: CartService) {}

    async getCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const cart = await this.cartService.getCart(userId);
            res.json({ message: "cart retrieved", data: cart });
        } catch (error) {
            console.error("[GET CART ERROR]", error);
            res.status(400).json({ message: "Failed to get cart" });
        }
    }

    async addItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { menuItemId, quantity }: AddToCartInput = req.body;
            const cart = await this.cartService.addItem(userId, menuItemId, quantity);
            res.status(201).json({ message: "item added to cart", data: cart });
        } catch (error) {
            console.error("[ADD TO CART ERROR]", error);
            res.status(400).json({ message: "Failed to add item to cart" });
        }
    }

    async updateCartItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const cartItemId = req.params.cartItemId as string;
            const { quantity }: UpdateCartItemInput = req.body;
            const cart = await this.cartService.updateItemQuantity(cartItemId, quantity, userId);
            res.json({ message: "cart item updated", data: cart });
        } catch (error) {
            console.error("[UPDATE CART ITEM ERROR]", error);
            res.status(400).json({ message: "Failed to update cart item" });
        }
    }

    async removeCartItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const cartItemId = req.params.cartItemId as string;
            const cart = await this.cartService.removeItem(cartItemId, userId);
            res.json({ message: "item removed from cart", data: cart });
        } catch (error) {
            console.error("[REMOVE CART ITEM ERROR]", error);
            res.status(400).json({ message: "Failed to remove cart item" });
        }
    }

    async clearCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const cart = await this.cartService.clearCart(userId);
            res.json({ message: "cart cleared", data: cart });
        } catch (error) {
            console.error("[CLEAR CART ERROR]", error);
            res.status(400).json({ message: "Failed to clear cart" });
        }
    }
}
