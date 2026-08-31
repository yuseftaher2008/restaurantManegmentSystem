import { Router } from "express";
import type { InventoryTransactionController } from "../controllers/inventoryTransaction.controller";
import { validate } from "../middlewares/validate";
import {
  createTransactionSchema,
  transactionFilterSchema,
} from "../validations/inventoryTransaction.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";
import { uuidParamsSchema } from "../validations/common.validation";

export function createInventoryTransactionRouter(
    inventoryTransactionController: InventoryTransactionController,
    authMiddleware: AuthMiddleware,
    staffAuthorization: AuthorizationMiddleware
) {
    const router = Router();

    /**
     * @swagger
     * /inventory/:
     *   get:
     *     tags: [Inventory]
     *     summary: Get low stock alerts
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Low stock alerts
     */
    router.get("/",
        authMiddleware.handle,
        staffAuthorization.handle,
        (req, res) => inventoryTransactionController.getLowStockAlerts(req, res)
    );

    /**
     * @swagger
     * /inventory/:
     *   post:
     *     tags: [Inventory]
     *     summary: Create inventory transaction
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [ingredientId, type, quantity, reference]
     *             properties:
     *               ingredientId:
     *                 type: string
     *                 format: uuid
     *               type:
     *                 type: string
     *                 enum: [IN, OUT, ADJUSTMENT]
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *               reference:
     *                 type: string
     *                 enum: [ORDER, MANUAL, RESTOCK]
     *               orderId:
     *                 type: string
     *                 format: uuid
     *     responses:
     *       201:
     *         description: Transaction created
     *       400:
     *         description: Failed to create transaction
     */
    router.post("/",
        validate(createTransactionSchema),
        authMiddleware.handle,
        staffAuthorization.handle,
        (req, res) => inventoryTransactionController.createTransaction(req, res)
    );

    /**
     * @swagger
     * /inventory/ingredient/{ingredientId}:
     *   get:
     *     tags: [Inventory]
     *     summary: Get transactions for an ingredient
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: ingredientId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Transactions retrieved
     */
    router.get("/ingredient/:ingredientId",
        authMiddleware.handle,
        staffAuthorization.handle,
        validate(uuidParamsSchema, "params"),
        (req, res) => inventoryTransactionController.getByIngredient(req, res)
    );

    return router;
}
