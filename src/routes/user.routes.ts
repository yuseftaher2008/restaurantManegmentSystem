import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, updateUserSchema, uuidParamsSchema } from "../validations/user.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";
import type { RateLimitRequestHandler } from "express-rate-limit";


export function createUserRouter(userController: UserController, authMiddleware: AuthMiddleware, authorizationMiddleware: AuthorizationMiddleware, authLimiter: RateLimitRequestHandler) {
    const router = Router();


    router.post("/register",
         authLimiter,
          validate(registerSchema),
           (req, res) => userController.register(req, res)
        );

    router.post("/login",
         authLimiter, 
         validate(loginSchema),
          (req, res) => userController.login(req, res)
        );

    router.patch("/:id",
         validate(uuidParamsSchema, "params"),
          validate(updateUserSchema), 
          authMiddleware.handle,
           (req, res) => userController.updateUser(req, res)
        );

    router.delete("/:id",
         validate(uuidParamsSchema,"params"),
        authorizationMiddleware.handle, 
        (req, res) => userController.deleteUser(req, res)
    );

    return router;
}
