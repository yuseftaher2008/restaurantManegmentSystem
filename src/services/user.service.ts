import type { UserRepository } from "../repositories/user.repository";
import type { User } from "../../generated/prisma/client";
import type { RegisterInput, LoginInput, UpdateUserInput } from "../validations/user.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async userRegister(data: RegisterInput): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`Registration failed`);
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
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

    async userLogin(data: LoginInput): Promise<string> {
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
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return token;
    }

    async userDelete(id: string): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }

    async userUpdate(id: string, data: UpdateUserInput): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        // [C-3] Verify current password when changing password
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
            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const user = await this.userRepository.update(id, updateData);
        const {password : _password, ...safeUser} = user;
        return safeUser;
    }
}