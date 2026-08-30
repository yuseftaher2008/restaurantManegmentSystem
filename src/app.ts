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
import { IngredientRepository } from "./repositories/ingredient.repository";
import { IngredientService } from "./services/ingredient.service";
import { IngredientController } from "./controllers/ingredient.controller";
import { createIngredientRouter } from "./routes/ingredient.routes";
import { MenuItemIngredientRepository } from "./repositories/menuItemIngredient.repository";
import { MenuItemIngredientService } from "./services/menuItemIngredient.service";
import { MenuItemIngredientController } from "./controllers/menuItemIngredient.controller";
import { createMenuItemIngredientRouter } from "./routes/menuItemIngredient.routes";
import { CartRepository } from "./repositories/cart.repository";
import { CartItemRepository } from "./repositories/cartItem.repository";
import { CartService } from "./services/cart.service";
import { CartController } from "./controllers/cart.controller";
import { createCartRouter } from "./routes/cart.routes";
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

const ingredientRepository = new IngredientRepository();
const ingredientService = new IngredientService(ingredientRepository);
const ingredientController = new IngredientController(ingredientService);

const menuItemIngredientRepository = new MenuItemIngredientRepository();
const menuItemIngredientService = new MenuItemIngredientService(menuItemIngredientRepository, menuItemRepository, ingredientRepository);
const menuItemIngredientController = new MenuItemIngredientController(menuItemIngredientService);

const cartRepository = new CartRepository();
const cartItemRepository = new CartItemRepository();
const cartService = new CartService(cartRepository, cartItemRepository, menuItemRepository);
const cartController = new CartController(cartService);

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
const ingredientAuthorization = new AuthorizationMiddleware([
    Role.ADMIN,
    Role.STAFF
]);
const ingredientAdminAuthorization = new AuthorizationMiddleware([
    Role.ADMIN
]);
const menuIngredientAuthorization = new AuthorizationMiddleware([
    Role.ADMIN,
    Role.STAFF
]);
const customerAuthorization = new AuthorizationMiddleware([
    Role.CUSTOMER,
    Role.STAFF,
    Role.ADMIN
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
    "/api/menu/:menuItemId/ingredients",
    createMenuItemIngredientRouter(menuItemIngredientController, authMiddleware, menuIngredientAuthorization)
);

app.use(
    "/api/menu",
    createMenuItemRouter(menuItemController, authMiddleware, menuAuthorization)
);

app.use(
    "/api/ingredients",
    createIngredientRouter(ingredientController, authMiddleware, ingredientAuthorization, ingredientAdminAuthorization)
);

app.use(
    "/api/cart",
    createCartRouter(cartController, authMiddleware, customerAuthorization)
);

app.use(errorHandler);

export default app;
