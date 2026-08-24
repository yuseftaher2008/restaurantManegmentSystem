import { Router } from "express";
import type { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../validations/category.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createCategoryRouter(categoryController: CategoryController, authMiddleware: AuthMiddleware, categoryAuthorization: AuthorizationMiddleware) {
  const router = Router();
  
  /**
   * @swagger
   * /category/:
   *   get:
   *     tags: [Category]
   *     summary: Get all categories
   *     responses:
   *       200:
   *         description: List of categories
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
   *                     $ref: '#/components/schemas/Category'
   */
  router.get("/",
    (req, res) => categoryController.getCategory(req, res)
  );

  /**
   * @swagger
   * /category/{id}:
   *   get:
   *     tags: [Category]
   *     summary: Get category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Category found
   *       404:
   *         description: Category not found
   */
  router.get("/:id",
    validate(categoryParamsSchema, "params"),
    (req, res) => categoryController.getCategoryById(req, res)
  );

  /**
   * @swagger
   * /category/:
   *   post:
   *     tags: [Category]
   *     summary: Create a category
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name]
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Category created
   *       400:
   *         description: Creating category has failed
   */
  router.post(
    "/",
    validate(createCategorySchema), authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.createCategory(req, res)
  );
  
  /**
   * @swagger
   * /category/{id}:
   *   patch:
   *     tags: [Category]
   *     summary: Update a category
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
   *     responses:
   *       200:
   *         description: Category updated
   *       400:
   *         description: Update failed
   */
  router.patch(
    "/:id",
    validate(categoryParamsSchema, "params"),
    validate(updateCategorySchema), authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.updateCategory(req, res)
  );

  /**
   * @swagger
   * /category/{id}:
   *   delete:
   *     tags: [Category]
   *     summary: Delete a category
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
   *         description: Category deleted
   *       400:
   *         description: Deletion failed
   */
  router.delete(
    "/:id",
    validate(categoryParamsSchema, "params"),
    authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.deleteCategory(req, res)
  );

  return router;
}
