import { prisma } from "../../lib/prisma";


export class CategoryRepository {

    async findById(id:string){
        return prisma.category.findUnique({
            where: { id }
        });
    }

    async findAll(id:string){
        return prisma.category.findMany();
    }

    async create(data:any){
        return prisma.category.create({
            data
        });
    }
    
    
}