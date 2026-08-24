import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import type { RegisterInput, LoginInput ,UpdateUserInput } from "../validations/user.validation";

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
            res.status(400).json({
                message: error instanceof Error ? error.message : "Registration failed"
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
            res.status(400).json({
                message: error instanceof Error ? error.message : "login failed"
            });
        }
    }

    async updateUser(req:Request,res: Response): Promise<void> {
        
        try {
            const id = req.params.id as string;
            const data : UpdateUserInput = req.body;
            const user = await this.userService.update(id , data);
            res.json({
                message: "user updated",
                user
            });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : "Update failed"
            });
            
        }
    }

    async deleteUser(req:Request,res:Response): Promise<void> {

        try {
            const id = req.params.id as string;
            const deletedUser = await this.userService.delete(id);
            res.status(204).send();
            
        } catch (error) {
            res.status(400).json({
                message : error instanceof Error ? error.message : 
                "user delete failed"
            });
        } 
    }
}
