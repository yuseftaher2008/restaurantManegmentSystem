import { CategoryRepository } from "../repositories/category.repository";
import type { CategoryCreateInput,CategoryUpdateInput } from "../../generated/prisma/models/Category";
import { Category } from "../../generated/prisma/client";

export class CategoryService {
    constructor(private categoryRepository:CategoryRepository){}

    async getCategory ():Promise<Category[]>{
        const categories = await this.categoryRepository.findAll();
        return categories;
    }

    async getById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if(!category){
            throw new Error(`category is not found`);
        }
        return category;
    }

    // [M-6] Handle race condition on category creation by catching unique constraint error
    async createCategory (data:CategoryCreateInput):Promise<Category> {
        const existingCategory = await this.categoryRepository.findByName(data.name)
        if(existingCategory){
            throw new Error(`category already exists`);
        }
        try {
            const createdCategory = await this.categoryRepository.create(data);
            return createdCategory;
        } catch (error) {

            if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
                throw new Error(`category already exists`);
            }
            throw error;
        }
    }
    
    async updateCategory (id:string,data:CategoryUpdateInput):Promise<Category> {
        const existingCategory = await this.categoryRepository.findById(id);
        if(!existingCategory){
            throw new Error(`category is not found`);
        }
        
        const updatedCategory = await this.categoryRepository.update(id,data);
        return updatedCategory;


    }
    
    async deleteCategory (id:string):Promise<Category> {
        const existingCategory = await this.categoryRepository.findById(id);
        if(!existingCategory){
            throw new Error(`category is not found`);
        }
        const deletedCategory = await this.categoryRepository.delete(id);
        return deletedCategory;
    }

}