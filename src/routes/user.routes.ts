import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, updateUserSchema, uuidParamsSchema } from "../validations/user.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";
import type { RateLimitRequestHandler } from "express-rate-limit";

// [L-2] Standardized route variable name to match category.routes.ts
export function createUserRouter(userController: UserController, authMiddleware: AuthMiddleware, authorizationMiddleware: AuthorizationMiddleware, authLimiter: RateLimitRequestHandler) {
    const router = Router();

    /**
     * @swagger
     * /user/register:
     *   post:
     *     tags: [Auth]
     *     summary: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [firstName, lastName, email, password]
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 8
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Registration failed
     */
    router.post("/register", authLimiter, validate(registerSchema), (req, res) => userController.register(req, res));

    /**
     * @swagger
     * /user/login:
     *   post:
     *     tags: [Auth]
     *     summary: Login user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       400:
     *         description: Login failed
     */
    router.post("/login", authLimiter, validate(loginSchema), (req, res) => userController.login(req, res));

    /**
     * @swagger
     * /user/{id}:
     *   patch:
     *     tags: [User]
     *     summary: Update user
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
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 8
     *               currentPassword:
     *                 type: string
     *     responses:
     *       200:
     *         description: User updated
     *       400:
     *         description: Update failed
     */
    router.patch("/:id", validate(uuidParamsSchema, "params"), validate(updateUserSchema), authMiddleware.handle, (req, res) => userController.updateUser(req, res));

    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     tags: [User]
     *     summary: Delete user
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
     *         description: User deleted
     *       400:
     *         description: Delete failed
     */
    router.delete("/:id", validate(uuidParamsSchema, "params"), authorizationMiddleware.handle, (req, res) => userController.deleteUser(req, res));

    return router;
}
