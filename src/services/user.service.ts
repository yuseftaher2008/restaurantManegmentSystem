import "dotenv/config"
import { UserRepository } from "../repositories/user.repository";
import type { RegisterInput, LoginInput } from "../validations/user.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = new UserRepository();

export class UserService {

    async userRegister(data: RegisterInput) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error(`Registration failed`);
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const hashedPassword: string = await bcrypt.hash(data.password, saltRounds);

        const user = await userRepository.create({
            ...data,
            password: hashedPassword
        });

        const { password: _password, ...safeUser } = user;

        return safeUser;
    }

    async userLogin(data: LoginInput) {
        const existingUser = await userRepository.findByEmail(data.email);
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
}