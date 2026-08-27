import { prisma } from "../../lib/prisma";
import type { MenuItem } from "../../generated/prisma/client";
import type { MenuItemUncheckedCreateInput, MenuItemUpdateInput } from "../../generated/prisma/models/MenuItem";
import { BaseRepository } from "./base.repository";

export class MenuItemRepository extends BaseRepository<MenuItem, MenuItemUncheckedCreateInput, MenuItemUpdateInput> {

    constructor() {
        super(prisma.menuItem);
    }

    async findByCategoryId(categoryId: string): Promise<MenuItem[]> {
        return prisma.menuItem.findMany({
            where: { categoryId },
        });
    }

    async findByIdWithCategory(id: string): Promise<MenuItem | null> {
        return prisma.menuItem.findUnique({
            where: { id },
            include: { category: true },
        });
    }

    async findAllWithCategory(): Promise<MenuItem[]> {
        return prisma.menuItem.findMany({
            include: { category: true },
        });
    }
}
