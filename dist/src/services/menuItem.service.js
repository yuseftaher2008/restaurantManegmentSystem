export class MenuItemService {
    menuItemRepository;
    constructor(menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }
    async getAll(categoryId) {
        if (categoryId) {
            return this.menuItemRepository.findByCategoryId(categoryId);
        }
        return this.menuItemRepository.findAllWithCategory();
    }
    async getById(id) {
        const menuItem = await this.menuItemRepository.findByIdWithCategory(id);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }
        return menuItem;
    }
    async create(data) {
        const createdMenuItem = await this.menuItemRepository.create(data);
        return createdMenuItem;
    }
    async update(id, data) {
        const existingMenuItem = await this.menuItemRepository.findById(id);
        if (!existingMenuItem) {
            throw new Error("Menu item not found");
        }
        const updatedMenuItem = await this.menuItemRepository.update(id, data);
        return updatedMenuItem;
    }
    async delete(id) {
        const existingMenuItem = await this.menuItemRepository.findById(id);
        if (!existingMenuItem) {
            throw new Error("Menu item not found");
        }
        const deletedMenuItem = await this.menuItemRepository.delete(id);
        return deletedMenuItem;
    }
}
