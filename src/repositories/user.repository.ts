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

    async findPaginated(page: number, limit: number): Promise<{ users: User[]; total: number }> {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count(),
        ]);
        return { users, total };
    }
}