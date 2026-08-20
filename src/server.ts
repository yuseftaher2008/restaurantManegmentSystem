import express from "express";
import type { Express } from "express";
import "dotenv/config";
import { validateEnv } from "./config/env";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./routes/user.routes";

const port = Number(process.env.PORT) || 3000;
const app: Express = express();

validateEnv();

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use(express.json({ limit: "20kb" }));
app.use("/api/user", createUserRouter(userController));

app.listen(port, () => console.log(`Running on port:${port}`));
