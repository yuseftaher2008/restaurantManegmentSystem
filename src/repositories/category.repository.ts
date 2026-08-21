import { prisma } from "../../lib/prisma";
import type { Category } from "../../generated/prisma/client";
import type { CategoryCreateInput } from "../../generated/prisma/models/Category";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<Category, CategoryCreateInput> {
    
    constructor(){
        super(prisma.category);
    }

    async create(data: CategoryCreateInput): Promise<Category> {
        return prisma.category.create({
            data
        });

    }
    async findByName(name:string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: {name}
        });
    }
}