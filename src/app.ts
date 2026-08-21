import express from "express";
import type { Express } from "express";
import { validateEnv } from "./config/env";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./routes/user.routes";
import { CategoryRepository } from "./repositories/category.repository";
import { CategoryService } from "./services/category.service";
import { CategoryController } from "./controllers/category.controller";
import { createCategoryRouter } from "./routes/category.routes";

validateEnv();

const app: Express = express();

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// Middleware
app.use(express.json({ limit: "20kb" }));

// Routes
app.use("/api/user", createUserRouter(userController));
app.use("/api/category", createCategoryRouter(categoryController));

export default app;
