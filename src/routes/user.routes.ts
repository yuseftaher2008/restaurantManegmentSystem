import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validations/user.validation";

const userController = new UserController();

export const userRouter = Router(); 

userRouter.post("/register", validate(registerSchema), userController.register);
userRouter.post("/login", validate(loginSchema), userController.login);
