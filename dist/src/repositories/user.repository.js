import { prisma } from "../../lib/prisma";
import { BaseRepository } from "./base.repository";
export class UserRepository extends BaseRepository {
    constructor() {
        super(prisma.user);
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
}
