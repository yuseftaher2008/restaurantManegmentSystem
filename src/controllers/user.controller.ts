import type { Request,Response } from "express";
import { UserService } from "../services/user.service";
import { userRegisterData,userLoginData } from "../types/user.types";

const userService = new UserService();

export class UserController {
    
    async register(req:Request,res:Response){

        try{
            const data:userRegisterData = req.body;
            const user = await userService.userRegister(data);
            res.status(201).json({
                message: "User registered successfully",
                user
            });

        }catch(error){
            res.status(400).json({
                message:error instanceof Error? error.message
                : "Registration failed"
            });
        }
    }

    async login(req:Request,res:Response){
        
        try{
            const data:userLoginData = req.body;
            const token:string = await userService.userLogin(data);
            res.json({
                message:"user logged in successfully",
                token
            });

        }catch(error){
            res.status(400).json({
                message:error instanceof Error? error.message
                : "login failed"
            });
        }
    }
}
