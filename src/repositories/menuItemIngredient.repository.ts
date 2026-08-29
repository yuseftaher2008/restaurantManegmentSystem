import { BaseRepository } from "./base.repository";
import { MenuItemIngredient } from "../../generated/prisma/client";
import { MenuItemIngredientUncheckedCreateInput, MenuItemIngredientUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

export class MenuItemIngredientRepository extends BaseRepository<MenuItemIngredient, MenuItemIngredientUncheckedCreateInput, MenuItemIngredientUpdateInput> {

    constructor() {
        super(prisma.menuItemIngredient);
    }

    async findByMenuItemId(menuItemId: string): Promise<MenuItemIngredient[]> {
        return prisma.menuItemIngredient.findMany({
            where: { menuItemId },
        });
    }

    async findByIngredientId(ingredientId: string): Promise<MenuItemIngredient[]> {
        return prisma.menuItemIngredient.findMany({
            where: { ingredientId },
        });
    }

    async findByMenuItemAndIngredient(menuItemId: string, ingredientId: string): Promise<MenuItemIngredient | null> {
        return prisma.menuItemIngredient.findUnique({
            where: { menuItemId_ingredientId: { menuItemId, ingredientId } },
        });
    }
}
