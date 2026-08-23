import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    constructor(private categoryService : CategoryService){}

    async getCategory(req:Request,res:Response):Promise<void> {
        try {
            
            const categories = await this.categoryService.getCategory();
            res.json(categories);

        } catch (error) {
            res.status(400).json({
                message: error instanceof Error? error.message :
                "try again later"
            });
        }
    }

    async createCategory(req:Request,res:Response):Promise<void> {
        try {
            const {name} = req.body;
            const createCategory = await this.categoryService.createCategory(name);
            res.status(201).json({
                message: "category created",
                createCategory
            });

        } catch (error) {
            res.status(400).json({
                message: error instanceof Error? error.message : 
                "creating category has failed"
            });
        }
    }

    async updateCategory(req:Request,res:Response):Promise<void> {
        try {
            const id:string = req.params.id as string;
            const data = req.body;
            const updateCategory = await this.categoryService.updateCategory(id,data);
            res.json({
                message: "category updated",
                updateCategory
            });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error? error.message :
                "update faield"
            })
            
        }
    }

    async deleteCategory(req:Request,res:Response):Promise<void> {
        try {
            const id:string = req.params.id as string;
            const deletedCategory = await this.categoryService.deleteCategory(id);
            res.json({
                message:"category deleted",
                deletedCategory
            });
            
        } catch (error) {
            res.status(400).json({
                message:error instanceof Error? error.message:
                "deletion failde"
            });            
        }
    }
}