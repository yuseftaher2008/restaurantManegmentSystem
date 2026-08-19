import { prisma } from "../../lib/prisma";
import type { RegisterInput } from "../validations/user.validation";


export class UserRepository {

    async findById(id:string){
        return prisma.user.findUnique({
            where: { id } 
        });
    }

    async findByEmail(email:string){
        return prisma.user.findUnique({
            where:{ email }
        })
    }

    async findAll(){
        return prisma.user.findMany();
    }

    async create(data:RegisterInput){
        return prisma.user.create({
            data
        });
    }

    

    async delete(id:string){
        return prisma.user.delete({
            where: { id }
        });
    }

    async update(id:string,data:any){
        return prisma.user.update({
            where: { id },
            data
        });
    }



}