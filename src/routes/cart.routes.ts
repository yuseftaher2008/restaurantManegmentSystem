import { Router } from "express";
import type { CartController } from "../controllers/cart.controller";
import { validate } from "../middlewares/validate";
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamsSchema,
} from "../validations/cart.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createCartRouter(
    cartController: CartController,
    authMiddleware: AuthMiddleware,
    customerAuthorization: AuthorizationMiddleware
) {
    const router = Router();

    /**
     * @swagger
     * /cart/:
     *   get:
     *     tags: [Cart]
     *     summary: Get current user's cart
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Cart retrieved
     *       401:
     *         description: Unauthorized
     */
    router.get("/",
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => cartController.getCart(req, res)
    );

    /**
     * @swagger
     * /cart/items:
     *   post:
     *     tags: [Cart]
     *     summary: Add item to cart
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [menuItemId]
     *             properties:
     *               menuItemId:
     *                 type: string
     *                 format: uuid
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *                 default: 1
     *     responses:
     *       201:
     *         description: Item added to cart
     *       400:
     *         description: Failed to add item
     */
    router.post("/items",
        validate(addToCartSchema),
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => cartController.addItem(req, res)
    );

    /**
     * @swagger
     * /cart/items/{cartItemId}:
     *   patch:
     *     tags: [Cart]
     *     summary: Update cart item quantity
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: cartItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [quantity]
     *             properties:
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *     responses:
     *       200:
     *         description: Cart item updated
     *       400:
     *         description: Failed to update
     */
    router.patch("/items/:cartItemId",
        validate(cartItemParamsSchema, "params"),
        validate(updateCartItemSchema),
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => cartController.updateCartItem(req, res)
    );

    /**
     * @swagger
     * /cart/items/{cartItemId}:
     *   delete:
     *     tags: [Cart]
     *     summary: Remove item from cart
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: cartItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Item removed from cart
     *       400:
     *         description: Failed to remove item
     */
    router.delete("/items/:cartItemId",
        validate(cartItemParamsSchema, "params"),
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => cartController.removeCartItem(req, res)
    );

    /**
     * @swagger
     * /cart/:
     *   delete:
     *     tags: [Cart]
     *     summary: Clear all items from cart
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Cart cleared
     *       400:
     *         description: Failed to clear cart
     */
    router.delete("/",
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => cartController.clearCart(req, res)
    );

    return router;
}
