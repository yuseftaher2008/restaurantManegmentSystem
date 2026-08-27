import jwt from "jsonwebtoken";
export class AuthMiddleware {
    jwtSecret;
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }
    ;
    handle(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    message: "Authorization header is missing"
                });
                return;
            }
            const [type, token] = authHeader.split(" ");
            if (type !== "Bearer" || !token) {
                res.status(401).json({
                    message: "Invalid token format"
                });
                return;
            }
            const decoded = jwt.verify(token, this.jwtSecret);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                message: "Invalid or expired token",
            });
        }
    }
}
