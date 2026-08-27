import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_SALT_ROUNDS, JWT_SECRET } from "../config/env";
export class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`Registration failed`);
        }
        const saltRounds = BCRYPT_SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        const user = await this.userRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword
        });
        const { password: _password, ...safeUser } = user;
        return safeUser;
    }
    async login(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (!existingUser) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, JWT_SECRET, { expiresIn: '7d' });
        return token;
    }
    async delete(id) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }
    async getById(id) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const { password: _password, ...safeUser } = existingUser;
        return safeUser;
    }
    async getAll() {
        const users = await this.userRepository.findAll();
        return users.map(({ password: _password, ...safeUser }) => safeUser);
    }
    async update(id, data) {
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
        const { password: _password, ...safeUser } = user;
        return safeUser;
    }
}
