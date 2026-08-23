import type { Request,Response,NextFunction } from "express";
import { Role } from "../../generated/prisma/enums";


export class AuthorizationMiddleware {
    constructor (private readonly allowedRoles:Role[]){}

    handle (req:Request,res:Response,next:NextFunction) {
        if (!req.user){
            res.status(401).json({
                message : "user is not authenticated"
            });
            return;
        }
        if (!this.allowedRoles.includes(req.user.role)){
            res.status(403).json({
                message : "You do not have permission to access this resource"
            });

            return;
        }
        next();
    }
}