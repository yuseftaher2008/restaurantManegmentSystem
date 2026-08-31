import { Router } from "express";
import type { PaymentController } from "../controllers/payment.controller";
import { validate } from "../middlewares/validate";
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
  paymentOrderParamsSchema,
} from "../validations/payment.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createPaymentRouter(
    paymentController: PaymentController,
    authMiddleware: AuthMiddleware,
    customerAuthorization: AuthorizationMiddleware,
    adminAuthorization: AuthorizationMiddleware
) {
    const router = Router();

    /**
     * @swagger
     * /payments/:
     *   post:
     *     tags: [Payment]
     *     summary: Create payment for an order
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [orderId, method, transactionReference]
     *             properties:
     *               orderId:
     *                 type: string
     *                 format: uuid
     *               method:
     *                 type: string
     *                 enum: [CASH, CARD, WALLET]
     *               transactionReference:
     *                 type: string
     *     responses:
     *       201:
     *         description: Payment created
     *       400:
     *         description: Failed to create payment
     */
    router.post("/",
        validate(createPaymentSchema),
        authMiddleware.handle,
        customerAuthorization.handle,
        (req, res) => paymentController.createPayment(req, res)
    );

    /**
     * @swagger
     * /payments/{id}/status:
     *   patch:
     *     tags: [Payment]
     *     summary: Update payment status
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
     *                 enum: [PAID, FAILED, REFUNDED]
     *     responses:
     *       200:
     *         description: Payment status updated
     *       400:
     *         description: Failed to update
     */
    router.patch("/:id/status",
        authMiddleware.handle,
        adminAuthorization.handle,
        validate(paymentOrderParamsSchema, "params"),
        validate(updatePaymentStatusSchema),
        (req, res) => paymentController.updatePaymentStatus(req, res)
    );

    /**
     * @swagger
     * /payments/order/{orderId}:
     *   get:
     *     tags: [Payment]
     *     summary: Get payment for an order
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: orderId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Payment found
     *       404:
     *         description: Payment not found
     */
    router.get("/order/:orderId",
        authMiddleware.handle,
        customerAuthorization.handle,
        validate(paymentOrderParamsSchema, "params"),
        (req, res) => paymentController.getPaymentByOrder(req, res)
    );

    return router;
}
