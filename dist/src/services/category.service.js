export class CategoryService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async getCategory() {
        const categories = await this.categoryRepository.findAll();
        return categories;
    }
    async getById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error(`category is not found`);
        }
        return category;
    }
    // [M-6] Handle race condition on category creation by catching unique constraint error
    async createCategory(data) {
        const existingCategory = await this.categoryRepository.findByName(data.name);
        if (existingCategory) {
            throw new Error(`category already exists`);
        }
        try {
            const createdCategory = await this.categoryRepository.create(data);
            return createdCategory;
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                throw new Error(`category already exists`);
            }
            throw error;
        }
    }
    async updateCategory(id, data) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error(`category is not found`);
        }
        const updatedCategory = await this.categoryRepository.update(id, data);
        return updatedCategory;
    }
    async deleteCategory(id) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error(`category is not found`);
        }
        const deletedCategory = await this.categoryRepository.delete(id);
        return deletedCategory;
    }
}
