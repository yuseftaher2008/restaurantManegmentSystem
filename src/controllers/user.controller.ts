import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import type { RegisterInput, LoginInput, UpdateUserInput } from "../validations/user.validation";

export class UserController {
    
    constructor(private userService: UserService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const data: RegisterInput = req.body;
            const user = await this.userService.register(data);
            res.status(201).json({
                message: "User registered successfully",
                user
            });
        } catch (error) {
            console.error("[REGISTER ERROR]", error);
            res.status(400).json({
                message: "Registration failed"
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const data: LoginInput = req.body;
            const token: string = await this.userService.login(data);
            res.json({
                message: "user logged in successfully",
                token
            });
        } catch (error) {
            console.error("[LOGIN ERROR]", error);
            res.status(400).json({
                message: "login failed"
            });
        }
    }



    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.user!.id;
            const user = await this.userService.getById(id);
            res.json({ user });
        } catch (error) {
            console.error("[GET PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to get profile" });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.user!.id;
            const data: UpdateUserInput = req.body;
            const user = await this.userService.update(id, data);
            res.json({ message: "profile updated", user });
        } catch (error) {
            console.error("[UPDATE PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to update profile" });
        }
    }

    async deleteProfile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.user!.id;
            await this.userService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("[DELETE PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to delete profile" });
        }
    }


    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAll();
            res.json({ users });
        } catch (error) {
            console.error("[GET ALL USERS ERROR]", error);
            res.status(400).json({ message: "Failed to get users" });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const user = await this.userService.getById(id);
            res.json({ user });
        } catch (error) {
            console.error("[GET USER ERROR]", error);
            res.status(400).json({ message: "Failed to get user" });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const data: UpdateUserInput = req.body;
            const user = await this.userService.update(id, data);
            res.json({ message: "user updated", user });
        } catch (error) {
            console.error("[UPDATE USER ERROR]", error);
            res.status(400).json({ message: "Update failed" });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.userService.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error("[DELETE USER ERROR]", error);
            res.status(400).json({ message: "user delete failed" });
        }
    }
}
