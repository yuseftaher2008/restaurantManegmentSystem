import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createMenuItemSchema, updateMenuItemSchema, menuItemParamsSchema, menuFilterSchema, } from "../validations/menuItem.validation";
export function createMenuItemRouter(menuItemController, authMiddleware, menuAuthorization) {
    const router = Router();
    /**
     * @swagger
     * /menu/:
     *   get:
     *     tags: [MenuItem]
     *     summary: Get all menu items
     *     parameters:
     *       - in: query
     *         name: categoryId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filter by category ID
     *     responses:
     *       200:
     *         description: List of menu items
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
     *                     $ref: '#/components/schemas/MenuItem'
     */
    router.get("/", validate(menuFilterSchema, "query"), (req, res) => menuItemController.getMenuItems(req, res));
    /**
     * @swagger
     * /menu/{id}:
     *   get:
     *     tags: [MenuItem]
     *     summary: Get menu item by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Menu item found
     *       404:
     *         description: Menu item not found
     */
    router.get("/:id", validate(menuItemParamsSchema, "params"), (req, res) => menuItemController.getMenuItemById(req, res));
    /**
     * @swagger
     * /menu/:
     *   post:
     *     tags: [MenuItem]
     *     summary: Create a menu item
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [categoryId, name, price, description]
     *             properties:
     *               categoryId:
     *                 type: string
     *                 format: uuid
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *               description:
     *                 type: string
     *               image:
     *                 type: string
     *                 format: uri
     *     responses:
     *       201:
     *         description: Menu item created
     *       400:
     *         description: Creating menu item has failed
     */
    router.post("/", validate(createMenuItemSchema), authMiddleware.handle, menuAuthorization.handle, (req, res) => menuItemController.createMenuItem(req, res));
    /**
     * @swagger
     * /menu/{id}:
     *   patch:
     *     tags: [MenuItem]
     *     summary: Update a menu item
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
     *               categoryId:
     *                 type: string
     *                 format: uuid
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *               description:
     *                 type: string
     *               image:
     *                 type: string
     *                 format: uri
     *     responses:
     *       200:
     *         description: Menu item updated
     *       400:
     *         description: Update failed
     */
    router.patch("/:id", validate(menuItemParamsSchema, "params"), validate(updateMenuItemSchema), authMiddleware.handle, menuAuthorization.handle, (req, res) => menuItemController.updateMenuItem(req, res));
    /**
     * @swagger
     * /menu/{id}:
     *   delete:
     *     tags: [MenuItem]
     *     summary: Delete a menu item
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
     *         description: Menu item deleted
     *       400:
     *         description: Deletion failed
     */
    router.delete("/:id", validate(menuItemParamsSchema, "params"), authMiddleware.handle, menuAuthorization.handle, (req, res) => menuItemController.deleteMenuItem(req, res));
    return router;
}
