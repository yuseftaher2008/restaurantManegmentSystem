import type { Request, Response } from "express";
import type { CategoryService } from "../services/category.service";
import type { UpdateCategoryInput } from "../validations/category.validation";

export class CategoryController {
    constructor(private categoryService: CategoryService){}

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            
            const categories = await this.categoryService.getCategory();
            res.json(categories);

        } catch (error) {
            
            console.error("[GET CATEGORIES ERROR]", error);
            res.status(400).json({
                message: "try again later"
            });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const createCategory = await this.categoryService.createCategory({ name });
            res.status(201).json({
                message: "category created",
                createCategory
            });

        } catch (error) {

            console.error("[CREATE CATEGORY ERROR]", error);
            res.status(400).json({
                message: "creating category has failed"
            });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            const data: UpdateCategoryInput = req.body;
            const updateCategory = await this.categoryService.updateCategory(id, data);
            res.json({
                message: "category updated",
                updateCategory
            });
        } catch (error) {
            console.error("[UPDATE CATEGORY ERROR]", error);
            res.status(400).json({
                message: "update failed"
            })
            
        }
    }

    // [M-7] Return 204 No Content instead of deleted object
    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const id: string = req.params.id as string;
            await this.categoryService.deleteCategory(id);
            // [M-7] Return 204 No Content like deleteUser does
            res.status(204).send();
            
        } catch (error) {
            // [M-11] Log error server-side, return generic message to client
            console.error("[DELETE CATEGORY ERROR]", error);
            res.status(400).json({
                message: "deletion failed"
            });            
        }
    }
}