import express from "express";
import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { validateEnv, BCRYPT_SALT_ROUNDS, JWT_SECRET } from "./config/env";
import swaggerOptions from "./config/swagger";
import { Role } from "../generated/prisma/enums";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./routes/user.routes";
import { CategoryRepository } from "./repositories/category.repository";
import { CategoryService } from "./services/category.service";
import { CategoryController } from "./controllers/category.controller";
import { createCategoryRouter } from "./routes/category.routes";
import { MenuItemRepository } from "./repositories/menuItem.repository";
import { MenuItemService } from "./services/menuItem.service";
import { MenuItemController } from "./controllers/menuItem.controller";
import { createMenuItemRouter } from "./routes/menuItem.routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { AuthorizationMiddleware } from "./middlewares/authorize.middleware";
import { requestId } from "./middlewares/requestId";

import { errorHandler } from "./middlewares/errorHandler";



const app: Express = express();

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const menuItemRepository = new MenuItemRepository();
const menuItemService = new MenuItemService(menuItemRepository);
const menuItemController = new MenuItemController(menuItemService);

const authMiddleware = new AuthMiddleware(JWT_SECRET);
const adminAuthorization = new AuthorizationMiddleware([
  Role.ADMIN,
]);
const categoryAuthorization = new AuthorizationMiddleware([
    Role.ADMIN,
    Role.STAFF
]);
const menuAuthorization = new AuthorizationMiddleware([
    Role.ADMIN,
    Role.STAFF
]);


app.use(requestId);

app.use(helmet());

app.use(cors());


app.use(morgan("combined"));


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts, please try again later" }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" }
});


app.use(express.json({ limit: "20kb" }));
app.use(generalLimiter);


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/user",
     createUserRouter(
        userController,
        authMiddleware,
        adminAuthorization,
        authLimiter
    )
);

app.use(
    "/api/category",
     createCategoryRouter(
        categoryController,
        authMiddleware,
        categoryAuthorization,
    )
);

app.use(
    "/api/menu",
    createMenuItemRouter(menuItemController, authMiddleware, menuAuthorization)
);


app.use(errorHandler);

export default app;
