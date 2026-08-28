import { BaseRepository } from "./base.repository";
import { Ingredient } from "../../generated/prisma/client";
import { IngredientUncheckedCreateInput,IngredientUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

export class IngredientRepository extends BaseRepository <Ingredient,IngredientUncheckedCreateInput,IngredientUpdateInput> {

    constructor(){
        super(prisma.ingredient);
    }
    
    async findByName(name:string):Promise <Ingredient | null> {
        return prisma.ingredient.findFirst({
            where: {name}
        });
    }

    
    async findLowStock(): Promise<Ingredient[]> {
        return prisma.$queryRaw<Ingredient[]>`
            SELECT *
            FROM ingredients
            WHERE quantity <= minimum_quantity
        `;
    }
}