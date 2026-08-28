import { Router } from "express";
import type { IngredientController } from "../controllers/ingredient.controller";
import { validate } from "../middlewares/validate";
import {
  createIngredientSchema,
  updateIngredientSchema,
  ingredientParamsSchema,
} from "../validations/ingredient.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createIngredientRouter(
    ingredientController: IngredientController,
    authMiddleware: AuthMiddleware,
    ingredientAuthorization: AuthorizationMiddleware,
    ingredientAdminAuthorization: AuthorizationMiddleware
) {
    const router = Router();

    /**
     * @swagger
     * /ingredients/:
     *   get:
     *     tags: [Ingredient]
     *     summary: Get all ingredients
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of ingredients
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Ingredient'
     */
    router.get("/",
        authMiddleware.handle,
        ingredientAuthorization.handle,
        (req, res) => ingredientController.getIngredients(req, res)
    );

    /**
     * @swagger
     * /ingredients/low-stock:
     *   get:
     *     tags: [Ingredient]
     *     summary: Get low stock ingredients
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of low stock ingredients
     */
    router.get("/low-stock",
        authMiddleware.handle,
        ingredientAuthorization.handle,
        (req, res) => ingredientController.getLowStock(req, res)
    );

    /**
     * @swagger
     * /ingredients/{id}:
     *   get:
     *     tags: [Ingredient]
     *     summary: Get ingredient by ID
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
     *         description: Ingredient found
     *       404:
     *         description: Ingredient not found
     */
    router.get("/:id",
        authMiddleware.handle,
        ingredientAuthorization.handle,
        validate(ingredientParamsSchema, "params"),
        (req, res) => ingredientController.getIngredientById(req, res)
    );

    /**
     * @swagger
     * /ingredients/:
     *   post:
     *     tags: [Ingredient]
     *     summary: Create an ingredient
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, unit, quantity, minimumQuantity]
     *             properties:
     *               name:
     *                 type: string
     *               unit:
     *                 type: string
     *                 enum: [KG, G, L, ML, PIECE]
     *               quantity:
     *                 type: integer
     *               minimumQuantity:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Ingredient created
     *       400:
     *         description: Creating ingredient has failed
     */
    router.post("/",
        validate(createIngredientSchema),
        authMiddleware.handle,
        ingredientAuthorization.handle,
        (req, res) => ingredientController.createIngredient(req, res)
    );

    /**
     * @swagger
     * /ingredients/{id}:
     *   patch:
     *     tags: [Ingredient]
     *     summary: Update an ingredient
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
     *             properties:
     *               name:
     *                 type: string
     *               unit:
     *                 type: string
     *                 enum: [KG, G, L, ML, PIECE]
     *               quantity:
     *                 type: integer
     *               minimumQuantity:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Ingredient updated
     *       400:
     *         description: Update failed
     */
    router.patch("/:id",
        validate(ingredientParamsSchema, "params"),
        validate(updateIngredientSchema),
        authMiddleware.handle,
        ingredientAuthorization.handle,
        (req, res) => ingredientController.updateIngredient(req, res)
    );

    /**
     * @swagger
     * /ingredients/{id}:
     *   delete:
     *     tags: [Ingredient]
     *     summary: Delete an ingredient
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
     *       204:
     *         description: Ingredient deleted
     *       400:
     *         description: Deletion failed
     */
    router.delete("/:id",
        validate(ingredientParamsSchema, "params"),
        authMiddleware.handle,
        ingredientAdminAuthorization.handle,
        (req, res) => ingredientController.deleteIngredient(req, res)
    );

    return router;
}
