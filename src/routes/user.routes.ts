import { Router } from "express";
import type { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, updateUserSchema, uuidParamsSchema } from "../validations/user.validation";

export function createUserRouter(userController: UserController) {
    const router = Router();

    router.post("/register", validate(registerSchema), (req, res) => userController.register(req, res));
    router.post("/login", validate(loginSchema), (req, res) => userController.login(req, res));
    router.post("/update/:id",(req,res) => userController.updateUser(req,res));
    router.delete("/:id",(req,res) => userController.deleteUser(req,res));

    return router;
}
