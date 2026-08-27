import { MenuItemRepository } from "../repositories/menuItem.repository";
import type { MenuItemUncheckedCreateInput, MenuItemUpdateInput } from "../../generated/prisma/models/MenuItem";
import type { MenuItem } from "../../generated/prisma/client";

export class MenuItemService {
    constructor(private menuItemRepository: MenuItemRepository) {}

    async getAll(categoryId?: string): Promise<MenuItem[]> {
        if (categoryId) {
            return this.menuItemRepository.findByCategoryId(categoryId);
        }
        return this.menuItemRepository.findAllWithCategory();
    }

    async getById(id: string): Promise<MenuItem> {
        const menuItem = await this.menuItemRepository.findByIdWithCategory(id);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }
        return menuItem;
    }

    async create(data: MenuItemUncheckedCreateInput): Promise<MenuItem> {
        const createdMenuItem = await this.menuItemRepository.create(data);
        return createdMenuItem;
    }

    async update(id: string, data: MenuItemUpdateInput): Promise<MenuItem> {
        const existingMenuItem = await this.menuItemRepository.findById(id);
        if (!existingMenuItem) {
            throw new Error("Menu item not found");
        }
        const updatedMenuItem = await this.menuItemRepository.update(id, data);
        return updatedMenuItem;
    }

    async delete(id: string): Promise<MenuItem> {
        const existingMenuItem = await this.menuItemRepository.findById(id);
        if (!existingMenuItem) {
            throw new Error("Menu item not found");
        }
        const deletedMenuItem = await this.menuItemRepository.delete(id);
        return deletedMenuItem;
    }
}
