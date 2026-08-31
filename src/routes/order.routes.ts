import { Router } from "express";
import type { OrderController } from "../controllers/order.controller";
import { validate } from "../middlewares/validate";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderParamsSchema,
} from "../validations/order.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createOrderRouter(
    orderController: OrderController,
    authMiddleware: AuthMiddleware,
    staffAuthorization: AuthorizationMiddleware,
    customerAuthorization: AuthorizationMiddleware
) {
    const router = Router();

    /**
     * @swagger
     * /orders/:
     *   post:
     *     tags: [Order]
     *     summary: Create order from cart
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [orderType]
     *             properties:
     *               orderType:
     *                 type: string
     *                 enum: [DINE_IN, TAKEAWAY, DELIVERY]
     *     responses:
     *       201:
     *         description: Order created
     *       400:
     *         description: Failed to create order
     */
    router.post("/",
        validate(createOrderSchema),
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => orderController.createOrder(req, res)
    );

    /**
     * @swagger
     * /orders/:
     *   get:
     *     tags: [Order]
     *     summary: Get all orders
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [PENDING, PREPARING, READY, COMPLETED, CANCELLED]
     *     responses:
     *       200:
     *         description: Orders retrieved
     *       401:
     *         description: Unauthorized
     */
    router.get("/",
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => orderController.getAllOrders(req, res)
    );

    /**
     * @swagger
     * /orders/{id}:
     *   get:
     *     tags: [Order]
     *     summary: Get order by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Order found
     *       404:
     *         description: Order not found
     */
    router.get("/:id",
        authMiddleware.handle,
        customerAuthorization.handle,
        validate(orderParamsSchema, "params"),
        (req, res) => orderController.getOrderById(req, res)
    );

    /**
     * @swagger
     * /orders/{id}/status:
     *   patch:
     *     tags: [Order]
     *     summary: Update order status
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
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
     *             required: [status]
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PREPARING, READY, COMPLETED, CANCELLED]
     *     responses:
     *       200:
     *         description: Order status updated
     *       400:
     *         description: Failed to update
     */
    router.patch("/:id/status",
        authMiddleware.handle,
        staffAuthorization.handle,
        validate(orderParamsSchema, "params"),
        validate(updateOrderStatusSchema),
        (req, res) => orderController.updateOrderStatus(req, res)
    );

    /**
     * @swagger
     * /orders/{id}:
     *   delete:
     *     tags: [Order]
     *     summary: Cancel own pending order
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Order cancelled
     *       400:
     *         description: Failed to cancel
     */
    router.delete("/:id",
        authMiddleware.handle,
        customerAuthorization.handle,
        validate(orderParamsSchema, "params"),
        (req, res) => orderController.cancelOrder(req, res)
    );

    return router;
}
