export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(req, res) {
        try {
            const data = req.body;
            const user = await this.userService.register(data);
            res.status(201).json({
                message: "User registered successfully",
                user
            });
        }
        catch (error) {
            console.error("[REGISTER ERROR]", error);
            res.status(400).json({
                message: "Registration failed"
            });
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            const token = await this.userService.login(data);
            res.json({
                message: "user logged in successfully",
                token
            });
        }
        catch (error) {
            console.error("[LOGIN ERROR]", error);
            res.status(400).json({
                message: "login failed"
            });
        }
    }
    async getProfile(req, res) {
        try {
            const id = req.user.id;
            const user = await this.userService.getById(id);
            res.json({ user });
        }
        catch (error) {
            console.error("[GET PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to get profile" });
        }
    }
    async updateProfile(req, res) {
        try {
            const id = req.user.id;
            const data = req.body;
            const user = await this.userService.update(id, data);
            res.json({ message: "profile updated", user });
        }
        catch (error) {
            console.error("[UPDATE PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to update profile" });
        }
    }
    async deleteProfile(req, res) {
        try {
            const id = req.user.id;
            await this.userService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error("[DELETE PROFILE ERROR]", error);
            res.status(400).json({ message: "Failed to delete profile" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAll();
            res.json({ users });
        }
        catch (error) {
            console.error("[GET ALL USERS ERROR]", error);
            res.status(400).json({ message: "Failed to get users" });
        }
    }
    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await this.userService.getById(id);
            res.json({ user });
        }
        catch (error) {
            console.error("[GET USER ERROR]", error);
            res.status(400).json({ message: "Failed to get user" });
        }
    }
    async updateUser(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const user = await this.userService.update(id, data);
            res.json({ message: "user updated", user });
        }
        catch (error) {
            console.error("[UPDATE USER ERROR]", error);
            res.status(400).json({ message: "Update failed" });
        }
    }
    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await this.userService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error("[DELETE USER ERROR]", error);
            res.status(400).json({ message: "user delete failed" });
        }
    }
}
