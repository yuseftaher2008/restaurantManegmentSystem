import { prisma } from "../../lib/prisma";
import type { User } from "../../generated/prisma/client";
import type { UserCreateInput, UserUpdateInput } from "../../generated/prisma/models/User";
import { BaseRepository } from "./base.repository";


export class UserRepository extends BaseRepository<User, UserCreateInput, UserUpdateInput> {
    
    constructor(){
        super(prisma.user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }
}