import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userController = new UserController();

export const userRouter = Router(); 

userRouter.post("/register",userController.register);
userRouter.post("/login",userController.login);
