import { prisma } from "../../lib/prisma";
import { BaseRepository } from "./base.repository";
export class CategoryRepository extends BaseRepository {
    constructor() {
        super(prisma.category);
    }
    async findByName(name) {
        return prisma.category.findUnique({
            where: { name }
        });
    }
}
