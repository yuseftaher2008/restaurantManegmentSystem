import { Router } from "express";
import type { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../validations/category.validation";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorize.middleware";

export function createCategoryRouter(categoryController: CategoryController,authMiddleware: AuthMiddleware,categoryAuthorization:AuthorizationMiddleware ) {
  const route = Router();
  
  route.get("/get",
    (req,res)=> categoryController.getCategory(req,res)
  );

  route.post(
    "/create",
    validate(createCategorySchema),authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.createCategory(req, res)
  );
  route.put(
    "/update/:id",
    validate(categoryParamsSchema, "params"),
    validate(updateCategorySchema),authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.updateCategory(req, res)
  );
  route.delete(
    "/delete/:id",
    validate(categoryParamsSchema, "params"),
    authMiddleware.handle,
    categoryAuthorization.handle,
    (req, res) => categoryController.deleteCategory(req, res)
  );

  return route;
}
