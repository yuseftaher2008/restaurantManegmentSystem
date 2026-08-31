import type { Request, Response } from "express";
import type { PaymentService } from "../services/payment.service";
import type { CreatePaymentInput, UpdatePaymentStatusInput } from "../validations/payment.validation";

export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    async createPayment(req: Request, res: Response): Promise<void> {
        try {
            const { orderId, method, transactionReference }: CreatePaymentInput = req.body;
            const payment = await this.paymentService.createPayment(orderId, method, transactionReference);
            res.status(201).json({ message: "payment created", data: payment });
        } catch (error) {
            console.error("[CREATE PAYMENT ERROR]", error);
            res.status(400).json({ message: "Failed to create payment" });
        }
    }

    async updatePaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const paymentId = req.params.id as string;
            const { status }: UpdatePaymentStatusInput = req.body;
            const payment = await this.paymentService.updatePaymentStatus(paymentId, status);
            res.json({ message: "payment status updated", data: payment });
        } catch (error) {
            console.error("[UPDATE PAYMENT STATUS ERROR]", error);
            res.status(400).json({ message: "Failed to update payment status" });
        }
    }

    async getPaymentByOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.orderId as string;
            const payment = await this.paymentService.getPaymentByOrder(orderId);
            res.json({ message: "payment retrieved", data: payment });
        } catch (error) {
            console.error("[GET PAYMENT ERROR]", error);
            res.status(404).json({ message: "Payment not found" });
        }
    }
}
