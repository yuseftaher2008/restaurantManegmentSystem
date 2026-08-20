import { prisma } from "../../lib/prisma";
import type { RegisterInput } from "../validations/user.validation";
import { BaseRepository } from "./base.repository";


export class UserRepository extends BaseRepository<RegisterInput> {
    
    constructor(){
        super(prisma.user);
    }


    async findByEmail(email:string){
        return prisma.user.findUnique({
            where:{ email }
        })
    }

}