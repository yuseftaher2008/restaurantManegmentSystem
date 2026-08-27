import { prisma } from "../../lib/prisma";
import { BaseRepository } from "./base.repository";
export class MenuItemRepository extends BaseRepository {
    constructor() {
        super(prisma.menuItem);
    }
    async findByCategoryId(categoryId) {
        return prisma.menuItem.findMany({
            where: { categoryId },
        });
    }
    async findByIdWithCategory(id) {
        return prisma.menuItem.findUnique({
            where: { id },
            include: { category: true },
        });
    }
    async findAllWithCategory() {
        return prisma.menuItem.findMany({
            include: { category: true },
        });
    }
}
