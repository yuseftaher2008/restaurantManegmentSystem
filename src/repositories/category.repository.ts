import { prisma } from "../../lib/prisma";
import type { Category } from "../../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<Category> {
    
    constructor(){
        super(prisma.category);
    }
}