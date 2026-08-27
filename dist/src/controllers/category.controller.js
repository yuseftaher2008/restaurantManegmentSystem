export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async getCategory(req, res) {
        try {
            const categories = await this.categoryService.getCategory();
            res.json({ message: "categories retrieved", data: categories });
        }
        catch (error) {
            console.error("[GET CATEGORIES ERROR]", error);
            res.status(400).json({ message: "Failed to get categories" });
        }
    }
    async getCategoryById(req, res) {
        try {
            const id = req.params.id;
            const category = await this.categoryService.getById(id);
            res.json({ message: "category retrieved", data: category });
        }
        catch (error) {
            console.error("[GET CATEGORY ERROR]", error);
            res.status(404).json({ message: "Category not found" });
        }
    }
    async createCategory(req, res) {
        try {
            const { name } = req.body;
            const category = await this.categoryService.createCategory({ name });
            res.status(201).json({ message: "category created", data: category });
        }
        catch (error) {
            console.error("[CREATE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to create category" });
        }
    }
    async updateCategory(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const category = await this.categoryService.updateCategory(id, data);
            res.json({ message: "category updated", data: category });
        }
        catch (error) {
            console.error("[UPDATE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to update category" });
        }
    }
    async deleteCategory(req, res) {
        try {
            const id = req.params.id;
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        }
        catch (error) {
            console.error("[DELETE CATEGORY ERROR]", error);
            res.status(400).json({ message: "Failed to delete category" });
        }
    }
}
