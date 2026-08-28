import { prisma } from "../../lib/prisma";
import type { Category } from "../../generated/prisma/client";
import type { CategoryCreateInput, CategoryUpdateInput } from "../../generated/prisma/models/Category";
import { BaseRepository } from "./base.repository";


export class CategoryRepository extends BaseRepository<Category, CategoryCreateInput, CategoryUpdateInput> {
    
    constructor(){
        super(prisma.category);
    }

    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name }
        });
    }
}