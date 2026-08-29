import type { Request, Response } from "express";
import type { MenuItemIngredientService } from "../services/menuItemIngredient.service";
import type { CreateMenuItemIngredientInput, UpdateMenuItemIngredientInput } from "../validations/menuItemIngredient.validation";

export class MenuItemIngredientController {
    constructor(private menuItemIngredientService: MenuItemIngredientService) {}

    async getByMenuItemId(req: Request, res: Response): Promise<void> {
        try {
            const menuItemId = req.params.menuItemId as string;
            const associations = await this.menuItemIngredientService.getAllByMenuItemId(menuItemId);
            res.json({ message: "menu item ingredients retrieved", data: associations });
        } catch (error) {
            console.error("[GET MENU ITEM INGREDIENTS ERROR]", error);
            res.status(400).json({ message: "Failed to get menu item ingredients" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const association = await this.menuItemIngredientService.getById(id);
            res.json({ message: "menu item ingredient retrieved", data: association });
        } catch (error) {
            console.error("[GET MENU ITEM INGREDIENT ERROR]", error);
            res.status(404).json({ message: "MenuItemIngredient not found" });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateMenuItemIngredientInput = req.body;
            const association = await this.menuItemIngredientService.create(data);
            res.status(201).json({ message: "menu item ingredient created", data: association });
        } catch (error) {
            console.error("[CREATE MENU ITEM INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to create menu item ingredient" });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const data: UpdateMenuItemIngredientInput = req.body;
            const association = await this.menuItemIngredientService.update(id, data);
            res.json({ message: "menu item ingredient updated", data: association });
        } catch (error) {
            console.error("[UPDATE MENU ITEM INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to update menu item ingredient" });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.menuItemIngredientService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("[DELETE MENU ITEM INGREDIENT ERROR]", error);
            res.status(400).json({ message: "Failed to delete menu item ingredient" });
        }
    }
}
