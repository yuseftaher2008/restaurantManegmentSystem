import { prisma } from "../../lib/prisma";
import type { User } from "../../generated/prisma/client";
import type { UserCreateInput } from "../../generated/prisma/models/User";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User, UserCreateInput> {
    
    constructor(){
        super(prisma.user);
    }

    async create(data: UserCreateInput): Promise<User> {
        return prisma.user.create({
            data
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }
}