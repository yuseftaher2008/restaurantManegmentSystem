import { Router } from "express";
import type { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../validations/category.validation";

export function createCategoryRouter(categoryController: CategoryController) {
  const route = Router();

  route.post(
    "/create",
    validate(createCategorySchema),
    (req, res) => categoryController.createCategory(req, res)
  );
  route.post(
    "/update/:id",
    validate(categoryParamsSchema, "params"),
    validate(updateCategorySchema),
    (req, res) => categoryController.updateCategory(req, res)
  );
  route.delete(
    "/delete/:id",
    validate(categoryParamsSchema, "params"),
    (req, res) => categoryController.deleteCategory(req, res)
  );

  return route;
}
