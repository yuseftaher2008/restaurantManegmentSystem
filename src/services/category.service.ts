import { CategoryRepository } from "../repositories/category.repository";
import type { CategoryCreateInput,CategoryUpdateInput } from "../../generated/prisma/models/Category";
import { Category } from "../../generated/prisma/client";

export class CategoryService {
    constructor(private categoryRepository:CategoryRepository){}

    async createCategory (data:CategoryCreateInput):Promise<Category> {
        const existingCategory = await this.categoryRepository.findByName(data.name)
        if(existingCategory){
            throw new Error(`category already exists`);
        }
        const createdCategory = await this.categoryRepository.create(data);
        return createdCategory;
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