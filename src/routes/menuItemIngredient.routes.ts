import { Router } from "express";
import type { MenuItemIngredientController } from "../controllers/menuItemIngredient.controller";
import { validate } from "../middlewares/validate";
import {
  createMenuItemIngredientSchema,
  updateMenuItemIngredientSchema,
  menuItemIngredientParamsSchema,
  menuItemIdParamsSchema,
} from "../validations/menuItemIngredient.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createMenuItemIngredientRouter(
    menuItemIngredientController: MenuItemIngredientController,
    authMiddleware: AuthMiddleware,
    menuIngredientAuthorization: AuthorizationMiddleware
) {
    const router = Router({ mergeParams: true });

    /**
     * @swagger
     * /menu/{menuItemId}/ingredients:
     *   get:
     *     tags: [MenuItemIngredient]
     *     summary: Get all ingredients for a menu item
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: menuItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: List of menu item ingredients
     */
    router.get("/",
        authMiddleware.handle,
        menuIngredientAuthorization.handle,
        validate(menuItemIdParamsSchema, "params"),
        (req, res) => menuItemIngredientController.getByMenuItemId(req, res)
    );

    /**
     * @swagger
     * /menu/{menuItemId}/ingredients/{id}:
     *   get:
     *     tags: [MenuItemIngredient]
     *     summary: Get a menu item ingredient by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: menuItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Menu item ingredient found
     *       404:
     *         description: MenuItemIngredient not found
     */
    router.get("/:id",
        authMiddleware.handle,
        menuIngredientAuthorization.handle,
        validate(menuItemIngredientParamsSchema, "params"),
        (req, res) => menuItemIngredientController.getById(req, res)
    );

    /**
     * @swagger
     * /menu/{menuItemId}/ingredients:
     *   post:
     *     tags: [MenuItemIngredient]
     *     summary: Add an ingredient to a menu item
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: menuItemId
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
     *             required: [ingredientId, quantityRequired]
     *             properties:
     *               ingredientId:
     *                 type: string
     *                 format: uuid
     *               quantityRequired:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Menu item ingredient created
     *       400:
     *         description: Creating menu item ingredient has failed
     */
    router.post("/",
        validate(createMenuItemIngredientSchema),
        authMiddleware.handle,
        menuIngredientAuthorization.handle,
        (req, res) => menuItemIngredientController.create(req, res)
    );

    /**
     * @swagger
     * /menu/{menuItemId}/ingredients/{id}:
     *   patch:
     *     tags: [MenuItemIngredient]
     *     summary: Update a menu item ingredient
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: menuItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
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
     *               quantityRequired:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Menu item ingredient updated
     *       400:
     *         description: Update failed
     */
    router.patch("/:id",
        validate(menuItemIngredientParamsSchema, "params"),
        validate(updateMenuItemIngredientSchema),
        authMiddleware.handle,
        menuIngredientAuthorization.handle,
        (req, res) => menuItemIngredientController.update(req, res)
    );

    /**
     * @swagger
     * /menu/{menuItemId}/ingredients/{id}:
     *   delete:
     *     tags: [MenuItemIngredient]
     *     summary: Remove an ingredient from a menu item
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: menuItemId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       204:
     *         description: Menu item ingredient deleted
     *       400:
     *         description: Deletion failed
     */
    router.delete("/:id",
        validate(menuItemIngredientParamsSchema, "params"),
        authMiddleware.handle,
        menuIngredientAuthorization.handle,
        (req, res) => menuItemIngredientController.delete(req, res)
    );

    return router;
}
