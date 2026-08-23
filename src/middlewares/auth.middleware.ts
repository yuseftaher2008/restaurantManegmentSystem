import type { Request,Response,NextFunction } from "express";
import { Role } from "../../generated/prisma/enums";
import jwt from "jsonwebtoken";


interface JwtPayload {
    id:string;
    email:string;
    role:Role;
}

export class AuthMiddleware {

    constructor(private readonly jwtSecret:string){};


    handle (req:Request,res:Response,next:NextFunction):void  {
        
        try {
            const authHeader  = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                  message: "Authorization header is missing"
                });
                return;
              }

              const [type,token] = authHeader.split(" ");

              if (type !== "Bearer" || !token) {
                res.status(401).json({
                    message: "Invalid token format"
                });
                return;
              }
              const decoded = jwt.verify(token,this.jwtSecret) as JwtPayload;

              req.user = {
                id : decoded.id,
                email : decoded.email,
                role : decoded.role
              };

        } catch (error) {

            res.status(401).json({
                message: "Invalid or expired token",
              });

        }
        next();
    }

}