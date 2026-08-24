import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import type { RegisterInput, LoginInput ,UpdateUserInput } from "../validations/user.validation";
import { Role } from "../../generated/prisma/enums";

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

    // [BUG-4] Added ownership check - users can only update their own profile unless ADMIN
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const data: UpdateUserInput = req.body;
            

            if (req.user?.id !== id && req.user?.role !== Role.ADMIN) {
                res.status(403).json({
                    message: "You can only update your own profile"
                });
                return;
            }
            
            const user = await this.userService.update(id, data);
            res.json({
                message: "user updated",
                user
            });
        } catch (error) {

            console.error("[UPDATE ERROR]", error);
            res.status(400).json({
                message: "Update failed"
            });
        }
    }

    async deleteUser(req:Request,res:Response): Promise<void> {

        try {
            const id = req.params.id as string;
            const deletedUser = await this.userService.delete(id);
            res.status(204).send();
            
        } catch (error) {

            console.error("[DELETE ERROR]", error);
            res.status(400).json({
                message: "user delete failed"
            });
        } 
    }
}
