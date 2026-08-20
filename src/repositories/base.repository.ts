import { prisma } from "../../lib/prisma";

export class BaseRepository<T> {
    protected model : any;

    constructor (model:any){
        this.model=model;
    }

    async findById(id:string): Promise<T | null>{
        return this.model.findUnique({
            where: { id } 
        });
    }

    async findAll(): Promise<T[] | null>{
        return this.model.findMany();
    }

    async create(data:T): Promise<T | null>{
        return this.model.create({
            data
        });
    }

    async delete(id:string){
        return this.model.delete({
            where: { id }
        });
    }

    async update(id:string,data:any): Promise<T | null>{
        return this.model.update({
            where: { id },
            data
        });
    }



}