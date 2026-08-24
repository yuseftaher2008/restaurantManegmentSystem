import { prisma } from "../../lib/prisma";
import type { User } from "../../generated/prisma/client";
// [H-6] Import UserUpdateInput type for proper typing of update operations
import type { UserCreateInput, UserUpdateInput } from "../../generated/prisma/models/User";
import { BaseRepository } from "./base.repository";

// [H-6] Added UserUpdateInput as third generic parameter for type-safe updates
export class UserRepository extends BaseRepository<User, UserCreateInput, UserUpdateInput> {
    
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