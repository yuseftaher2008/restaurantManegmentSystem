import type { UserRepository } from "../repositories/user.repository";
import type { User } from "../../generated/prisma/client";
import type { RegisterInput, LoginInput, UpdateUserInput } from "../validations/user.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_SALT_ROUNDS, JWT_SECRET } from "../config/env";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async register(data: RegisterInput): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`Registration failed`);
        }


        const saltRounds = BCRYPT_SALT_ROUNDS;
        const hashedPassword: string = await bcrypt.hash(data.password, saltRounds);

        const user = await this.userRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword
        });

        const { password: _password, ...safeUser } = user;

        return safeUser;
    }

    async login(data: LoginInput): Promise<string> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (!existingUser) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return token;
    }

    async delete(id: string): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }

    async getById(id: string): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const { password: _password, ...safeUser } = existingUser;
        return safeUser;
    }

    async getAll(page: number = 1, limit: number = 20): Promise<{ users: Omit<User, 'password'>[]; total: number; page: number; limit: number }> {
        const { users, total } = await this.userRepository.findPaginated(page, limit);
        return {
            users: users.map(({ password: _password, ...safeUser }) => safeUser),
            total,
            page,
            limit,
        };
    }

    async update(id: string, data: UpdateUserInput): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (data.password) {
            if (!data.currentPassword) {
                throw new Error('Current password is required when changing password');
            }
            const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, existingUser.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
        }


        const { currentPassword: _, ...updateData } = data;

        
        if (updateData.password) {

        const saltRounds = BCRYPT_SALT_ROUNDS;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const user = await this.userRepository.update(id, updateData);
        const {password : _password, ...safeUser} = user;
        return safeUser;
    }
}