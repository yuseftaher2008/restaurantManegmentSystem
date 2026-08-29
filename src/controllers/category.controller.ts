import type { Request, Response } from "express";
import type { CategoryService } from "../services/category.service";
import type { CreateCategoryInput, UpdateCategoryInput } from "../validations/category.validation";

export class CategoryController {
    constructor(private categoryService: CategoryService){}

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.categoryService.getCategory();
            res.json({ message: "categories retrieved", data: categories });
        } catch (error) {
            console.error("[GET CATEGORIES ERROR]", error);
            res.status(400).json({ message: "Failed to get categories" });
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const category = await this.categoryService.getById(id);
            res.json({ message: "category retrieved", data: category });
        } catch (error) {
            console.error("[GET CATEGORY ERROR]", error);
            res.status(404).json({ message: "Category not found" });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name }: CreateCategoryInput = req.body;
            const category = await this.categoryService.createCategory({ name });
            res.status(201).json({ message: "category created", data: category });
        } catch (error) {
            console.error("[CREATE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to create category" });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            const data: UpdateCategoryInput = req.body;
            const category = await this.categoryService.updateCategory(id, data);
            res.json({ message: "category updated", data: category });
        } catch (error) {
            console.error("[UPDATE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to update category" });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            console.error("[DELETE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to delete category" });
        }
    }
}
