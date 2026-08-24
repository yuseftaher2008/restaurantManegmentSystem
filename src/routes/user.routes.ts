import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, updateUserSchema, uuidParamsSchema } from "../validations/user.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";
import type { RateLimitRequestHandler } from "express-rate-limit";

export function createUserRouter(
    userController: UserController,
    authMiddleware: AuthMiddleware,
    adminAuthorization: AuthorizationMiddleware,
    authLimiter: RateLimitRequestHandler
) {
    const router = Router();

    // ─── Public routes ────────────────────────────────────────────────────

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

    // ─── Profile routes (any authenticated user, ID from JWT) ─────────────

    /**
     * @swagger
     * /user/profile:
     *   get:
     *     tags: [User]
     *     summary: Get own profile
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile
     *       401:
     *         description: Unauthorized
     */
    router.get("/profile", authMiddleware.handle, (req, res) => userController.getProfile(req, res));

    /**
     * @swagger
     * /user/profile:
     *   patch:
     *     tags: [User]
     *     summary: Update own profile
     *     security:
     *       - bearerAuth: []
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
     *         description: Profile updated
     *       400:
     *         description: Update failed
     */
    router.patch("/profile", authMiddleware.handle, validate(updateUserSchema), (req, res) => userController.updateProfile(req, res));

    /**
     * @swagger
     * /user/profile:
     *   delete:
     *     tags: [User]
     *     summary: Delete own account
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       204:
     *         description: Account deleted
     *       400:
     *         description: Delete failed
     */
    router.delete("/profile", authMiddleware.handle, (req, res) => userController.deleteProfile(req, res));

    // ─── Admin routes (target user by :id param) ──────────────────────────

    /**
     * @swagger
     * /user/:
     *   get:
     *     tags: [User]
     *     summary: Get all users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of users
     *       403:
     *         description: Admin only
     */
    router.get("/", authMiddleware.handle, adminAuthorization.handle, (req, res) => userController.getAllUsers(req, res));

    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     tags: [User]
     *     summary: Get user by ID (admin)
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
     *         description: User found
     *       404:
     *         description: User not found
     */
    router.get("/:id", authMiddleware.handle, adminAuthorization.handle, (req, res) => userController.getUserById(req, res));

    /**
     * @swagger
     * /user/{id}:
     *   patch:
     *     tags: [User]
     *     summary: Update user by ID (admin)
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
     *               role:
     *                 type: string
     *                 enum: [ADMIN, STAFF, CUSTOMER]
     *     responses:
     *       200:
     *         description: User updated
     *       400:
     *         description: Update failed
     */
    router.patch("/:id", authMiddleware.handle, adminAuthorization.handle, validate(uuidParamsSchema, "params"), validate(updateUserSchema), (req, res) => userController.updateUser(req, res));

    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     tags: [User]
     *     summary: Delete user by ID (admin)
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
    router.delete("/:id", authMiddleware.handle, adminAuthorization.handle, validate(uuidParamsSchema, "params"), (req, res) => userController.deleteUser(req, res));

    return router;
}
