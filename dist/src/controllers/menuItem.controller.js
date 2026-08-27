export class MenuItemController {
    menuItemService;
    constructor(menuItemService) {
        this.menuItemService = menuItemService;
    }
    async getMenuItems(req, res) {
        try {
            const { categoryId } = req.query;
            const items = await this.menuItemService.getAll(categoryId);
            res.json({ message: "menu items retrieved", data: items });
        }
        catch (error) {
            console.error("[GET MENU ITEMS ERROR]", error);
            res.status(400).json({ message: "Failed to get menu items" });
        }
    }
    async getMenuItemById(req, res) {
        try {
            const id = req.params.id;
            const item = await this.menuItemService.getById(id);
            res.json({ message: "menu item retrieved", data: item });
        }
        catch (error) {
            console.error("[GET MENU ITEM ERROR]", error);
            res.status(404).json({ message: "Menu item not found" });
        }
    }
    async createMenuItem(req, res) {
        try {
            const item = await this.menuItemService.create(req.body);
            res.status(201).json({ message: "menu item created", data: item });
        }
        catch (error) {
            console.error("[CREATE MENU ITEM ERROR]", error);
            res.status(400).json({ message: "Failed to create menu item" });
        }
    }
    async updateMenuItem(req, res) {
        try {
            const id = req.params.id;
            const item = await this.menuItemService.update(id, req.body);
            res.json({ message: "menu item updated", data: item });
        }
        catch (error) {
            console.error("[UPDATE MENU ITEM ERROR]", error);
            res.status(400).json({ message: "Failed to update menu item" });
        }
    }
    async deleteMenuItem(req, res) {
        try {
            const id = req.params.id;
            await this.menuItemService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            console.error("[DELETE MENU ITEM ERROR]", error);
            res.status(400).json({ message: "Failed to delete menu item" });
        }
    }
}
