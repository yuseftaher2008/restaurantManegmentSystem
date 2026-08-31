import { InventoryTransactionRepository } from "../repositories/inventoryTransaction.repository";
import { IngredientRepository } from "../repositories/ingredient.repository";
import { Ingredient } from "../../generated/prisma/client";

export class InventoryTransactionService {
    constructor(
        private inventoryTransactionRepository: InventoryTransactionRepository,
        private ingredientRepository: IngredientRepository
    ) {}

    async createTransaction(data: {
        ingredientId: string;
        type: string;
        quantity: number;
        reference: string;
        orderId?: string;
    }) {
        const ingredient = await this.ingredientRepository.findById(data.ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        if (data.type === "OUT") {
            if (ingredient.quantity < data.quantity) {
                throw new Error("Insufficient stock");
            }
            await this.ingredientRepository.update(data.ingredientId, {
                quantity: ingredient.quantity - data.quantity,
            });
        } else if (data.type === "IN") {
            await this.ingredientRepository.update(data.ingredientId, {
                quantity: ingredient.quantity + data.quantity,
            });
        } else if (data.type === "ADJUSTMENT") {
            await this.ingredientRepository.update(data.ingredientId, {
                quantity: data.quantity,
            });
        }

        return this.inventoryTransactionRepository.create({
            ingredientId: data.ingredientId,
            type: data.type as any,
            quantity: data.quantity,
            reference: data.reference as any,
            orderId: data.orderId || null,
        });
    }

    async getByIngredient(ingredientId: string) {
        return this.inventoryTransactionRepository.findByIngredientId(ingredientId);
    }

    async getLowStockAlerts() {
        return this.ingredientRepository.findLowStock();
    }
}
