import { prisma } from "../../lib/prisma";
import type { Category } from "../../generated/prisma/client";
// [H-6] Import CategoryUpdateInput type for proper typing of update operations
import type { CategoryCreateInput, CategoryUpdateInput } from "../../generated/prisma/models/Category";
import { BaseRepository } from "./base.repository";

// [H-6] Added CategoryUpdateInput as third generic parameter for type-safe updates
export class CategoryRepository extends BaseRepository<Category, CategoryCreateInput, CategoryUpdateInput> {
    
    constructor(){
        super(prisma.category);
    }

    async create(data: CategoryCreateInput): Promise<Category> {
        return prisma.category.create({
            data
        });

    }
    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name }
        });
    }
}