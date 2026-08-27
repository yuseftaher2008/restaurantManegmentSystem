export class AuthorizationMiddleware {
    allowedRoles;
    constructor(allowedRoles) {
        this.allowedRoles = allowedRoles;
    }
    handle(req, res, next) {
        if (!req.user) {
            res.status(401).json({
                message: "user is not authenticated"
            });
            return;
        }
        if (!this.allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: "You do not have permission to access this resource"
            });
            return;
        }
        next();
    }
}
