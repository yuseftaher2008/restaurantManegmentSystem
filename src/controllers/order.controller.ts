import type { Request, Response } from "express";
import type { OrderService } from "../services/order.service";
import type { CreateOrderInput, UpdateOrderStatusInput } from "../validations/order.validation";

export class OrderController {
    constructor(private orderService: OrderService) {}

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { orderType }: CreateOrderInput = req.body;
            const order = await this.orderService.createOrder(userId, orderType);
            res.status(201).json({ message: "order created", data: order });
        } catch (error) {
            console.error("[CREATE ORDER ERROR]", error);
            res.status(400).json({ message: "Failed to create order" });
        }
    }

    async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;
            const status = req.query.status as string | undefined;
            const orders = await this.orderService.getAllOrders(userId, role, status);
            res.json({ message: "orders retrieved", data: orders });
        } catch (error) {
            console.error("[GET ORDERS ERROR]", error);
            res.status(400).json({ message: "Failed to get orders" });
        }
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id as string;
            const userId = req.user!.id;
            const role = req.user!.role;
            const order = await this.orderService.getOrderById(orderId, userId, role);
            res.json({ message: "order retrieved", data: order });
        } catch (error) {
            console.error("[GET ORDER ERROR]", error);
            res.status(404).json({ message: "Order not found" });
        }
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id as string;
            const { status }: UpdateOrderStatusInput = req.body;
            const order = await this.orderService.updateOrderStatus(orderId, status);
            res.json({ message: "order status updated", data: order });
        } catch (error) {
            console.error("[UPDATE ORDER STATUS ERROR]", error);
            res.status(400).json({ message: "Failed to update order status" });
        }
    }

    async cancelOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id as string;
            const userId = req.user!.id;
            const order = await this.orderService.cancelOrder(orderId, userId);
            res.json({ message: "order cancelled", data: order });
        } catch (error) {
            console.error("[CANCEL ORDER ERROR]", error);
            res.status(400).json({ message: "Failed to cancel order" });
        }
    }
}
