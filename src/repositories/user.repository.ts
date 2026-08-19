import { prisma } from "../../lib/prisma";
import { userRegisterData,userLoginData } from "../types/user.types";


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

    async create(data:userRegisterData){
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