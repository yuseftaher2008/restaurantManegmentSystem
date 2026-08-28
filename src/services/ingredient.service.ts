import { Ingredient } from "../../generated/prisma/client";
import { IngredientUncheckedCreateInput, IngredientUpdateInput } from "../../generated/prisma/models";
import type { IngredientRepository } from "../repositories/ingredient.repository";

export class IngredientService {

    constructor(private ingredientRepository : IngredientRepository) {}


    async getAll():Promise<Ingredient[]> {

        return await this.ingredientRepository.findAll();
    }

    async getById(id:string):Promise<Ingredient | null> {
        const ingredient = await this.ingredientRepository.findById(id);
        if (!ingredient) {
            throw new Error (`Ingredient not found`);
        }
        return ingredient;
    }

    async getLowStock():Promise<Ingredient[] | null> {
        const ingredients = await this.ingredientRepository.findLowStock();
        if (!ingredients) {
            throw new Error (`No low stock ingredients`);
        }
        return ingredients;
    }

    async create(data:IngredientUncheckedCreateInput):Promise<Ingredient> {
        const createdIngredient = await this.ingredientRepository.create(data);
        return createdIngredient;
    }

    async update(id:string,data:IngredientUpdateInput):Promise<Ingredient> {
        const existingIngredient = await this.ingredientRepository.findById(id);
        if (!existingIngredient){
            throw new Error(`Ingredient doesnt exisit`);
        }

        const updatedIngredient = await this.ingredientRepository.update(id,data);
        return updatedIngredient;
    }

    async delete(id:string):Promise<Ingredient> {

        const existingIngredient = await this.ingredientRepository.findById(id);
        if(!existingIngredient) {
            throw new Error(`Ingredient not found`);
        }

        const deletedIngredient = await this.ingredientRepository.delete(id);
        return deletedIngredient; 
    }
}