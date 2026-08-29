import { MenuItemIngredient } from "../../generated/prisma/client";
import { MenuItemIngredientUncheckedCreateInput, MenuItemIngredientUpdateInput } from "../../generated/prisma/models";
import type { MenuItemIngredientRepository } from "../repositories/menuItemIngredient.repository";
import type { MenuItemRepository } from "../repositories/menuItem.repository";
import type { IngredientRepository } from "../repositories/ingredient.repository";

export class MenuItemIngredientService {

    constructor(
        private menuItemIngredientRepository: MenuItemIngredientRepository,
        private menuItemRepository: MenuItemRepository,
        private ingredientRepository: IngredientRepository
    ) {}

    async getAllByMenuItemId(menuItemId: string): Promise<MenuItemIngredient[]> {
        return await this.menuItemIngredientRepository.findByMenuItemId(menuItemId);
    }

    async getAllByIngredientId(ingredientId: string): Promise<MenuItemIngredient[]> {
        return await this.menuItemIngredientRepository.findByIngredientId(ingredientId);
    }

    async getById(id: string): Promise<MenuItemIngredient> {
        const association = await this.menuItemIngredientRepository.findById(id);
        if (!association) {
            throw new Error("MenuItemIngredient not found");
        }
        return association;
    }

    async create(data: MenuItemIngredientUncheckedCreateInput): Promise<MenuItemIngredient> {
        const menuItem = await this.menuItemRepository.findById(data.menuItemId);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        const ingredient = await this.ingredientRepository.findById(data.ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        const existing = await this.menuItemIngredientRepository.findByMenuItemAndIngredient(
            data.menuItemId,
            data.ingredientId
        );
        if (existing) {
            throw new Error("Association already exists for this menu item and ingredient");
        }

        return await this.menuItemIngredientRepository.create(data);
    }

    async update(id: string, data: MenuItemIngredientUpdateInput): Promise<MenuItemIngredient> {
        const existing = await this.menuItemIngredientRepository.findById(id);
        if (!existing) {
            throw new Error("MenuItemIngredient not found");
        }

        return await this.menuItemIngredientRepository.update(id, data);
    }

    async delete(id: string): Promise<MenuItemIngredient> {
        const existing = await this.menuItemIngredientRepository.findById(id);
        if (!existing) {
            throw new Error("MenuItemIngredient not found");
        }

        return await this.menuItemIngredientRepository.delete(id);
    }
}
