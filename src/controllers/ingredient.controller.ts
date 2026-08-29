import type { Request, Response } from "express";
import type { IngredientService } from "../services/ingredient.service";
import type { CreateIngredientInput, UpdateIngredientInput } from "../validations/ingredient.validation";

export class IngredientController {
    constructor(private ingredientService: IngredientService) {}

    async getIngredients(req: Request, res: Response): Promise<void> {
        try {
            const ingredients = await this.ingredientService.getAll();
            res.json({ message: "ingredients retrieved", data: ingredients });
        } catch (error) {
            console.error("[GET INGREDIENTS ERROR]", error);
            res.status(400).json({ message: "Failed to get ingredients" });
        }
    }

    async getLowStock(req: Request, res: Response): Promise<void> {
        try {
            const ingredients = await this.ingredientService.getLowStock();
            res.json({ message: "low stock ingredients retrieved", data: ingredients });
        } catch (error) {
            console.error("[GET LOW STOCK ERROR]", error);
            res.status(400).json({ message: "Failed to get low stock ingredients" });
        }
    }

    async getIngredientById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const ingredient = await this.ingredientService.getById(id);
            res.json({ message: "ingredient retrieved", data: ingredient });
        } catch (error) {
            console.error("[GET INGREDIENT ERROR]", error);
            res.status(404).json({ message: "Ingredient not found" });
        }
    }

    async createIngredient(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateIngredientInput = req.body;
            const ingredient = await this.ingredientService.create(data);
            res.status(201).json({ message: "ingredient created", data: ingredient });
        } catch (error) {
            console.error("[CREATE INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to create ingredient" });
        }
    }

    async updateIngredient(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const data: UpdateIngredientInput = req.body;
            const ingredient = await this.ingredientService.update(id, data);
            res.json({ message: "ingredient updated", data: ingredient });
        } catch (error) {
            console.error("[UPDATE INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to update ingredient" });
        }
    }

    async deleteIngredient(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.ingredientService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("[DELETE INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to delete ingredient" });
        }
    }
}
