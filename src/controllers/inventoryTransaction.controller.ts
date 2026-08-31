import type { Request, Response } from "express";
import type { InventoryTransactionService } from "../services/inventoryTransaction.service";
import type { CreateTransactionInput } from "../validations/inventoryTransaction.validation";

export class InventoryTransactionController {
    constructor(private inventoryTransactionService: InventoryTransactionService) {}

    async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateTransactionInput = req.body;
            const transaction = await this.inventoryTransactionService.createTransaction(data);
            res.status(201).json({ message: "transaction created", data: transaction });
        } catch (error) {
            console.error("[CREATE TRANSACTION ERROR]", error);
            res.status(400).json({ message: "Failed to create transaction" });
        }
    }

    async getByIngredient(req: Request, res: Response): Promise<void> {
        try {
            const ingredientId = req.params.ingredientId as string;
            const transactions = await this.inventoryTransactionService.getByIngredient(ingredientId);
            res.json({ message: "transactions retrieved", data: transactions });
        } catch (error) {
            console.error("[GET TRANSACTIONS ERROR]", error);
            res.status(400).json({ message: "Failed to get transactions" });
        }
    }

    async getLowStockAlerts(req: Request, res: Response): Promise<void> {
        try {
            const alerts = await this.inventoryTransactionService.getLowStockAlerts();
            res.json({ message: "low stock alerts retrieved", data: alerts });
        } catch (error) {
            console.error("[GET LOW STOCK ALERTS ERROR]", error);
            res.status(400).json({ message: "Failed to get low stock alerts" });
        }
    }
}
