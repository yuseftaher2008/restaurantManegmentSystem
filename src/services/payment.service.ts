import { OrderRepository } from "../repositories/order.repository";
import { PaymentRepository } from "../repositories/payment.repository";

export class PaymentService {
    constructor(
        private paymentRepository: PaymentRepository,
        private orderRepository: OrderRepository
    ) {}

    async createPayment(orderId: string, method: string, transactionReference: string) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        const existingPayment = await this.paymentRepository.findByOrderId(orderId);
        if (existingPayment) {
            throw new Error("Payment already exists for this order");
        }

        return this.paymentRepository.create({
            orderId,
            amount: Number(order.totalAmount),
            method: method as any,
            status: "PENDING",
            transactionReference,
        });
    }

    async updatePaymentStatus(paymentId: string, status: string) {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new Error("Payment not found");
        }

        const updateData: any = { status };
        if (status === "PAID") {
            updateData.paidAt = new Date();
        }

        return this.paymentRepository.update(paymentId, updateData);
    }

    async getPaymentByOrder(orderId: string) {
        const payment = await this.paymentRepository.findByOrderId(orderId);
        if (!payment) {
            throw new Error("Payment not found");
        }
        return payment;
    }
}
