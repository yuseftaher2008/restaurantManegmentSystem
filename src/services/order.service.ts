import { CartRepository } from "../repositories/cart.repository";
import { CartItemRepository } from "../repositories/cartItem.repository";
import { MenuItemRepository } from "../repositories/menuItem.repository";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/orderItem.repository";
import { Role } from "../../generated/prisma/enums";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};

export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private orderItemRepository: OrderItemRepository,
        private cartRepository: CartRepository,
        private cartItemRepository: CartItemRepository,
        private menuItemRepository: MenuItemRepository
    ) {}

    async createOrder(userId: string, orderType: string) {
        const cart = await this.cartRepository.findWithItemsByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let totalAmount = 0;
        const orderItemsData: { menuItemId: string; quantity: number; unitPrice: number }[] = [];

        for (const item of cart.items) {
            const menuItem = await this.menuItemRepository.findById(item.menuItemId);
            if (!menuItem) {
                throw new Error(`Menu item not found: ${item.menuItemId}`);
            }
            const price = Number(menuItem.price);
            totalAmount += price * item.quantity;
            orderItemsData.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: price,
            });
        }

        const order = await this.orderRepository.create({
            userId,
            orderType: orderType as any,
            totalAmount,
            status: "PENDING",
        });

        for (const itemData of orderItemsData) {
            await this.orderItemRepository.create({
                orderId: order.id,
                menuItemId: itemData.menuItemId,
                quantity: itemData.quantity,
                unitPrice: itemData.unitPrice,
            });
        }

        await this.cartItemRepository.deleteByCartId(cart.id);

        return this.orderRepository.findOrderWithItems(order.id);
    }

    async getAllOrders(userId: string, role: string, status?: string) {
        if (role === Role.ADMIN || role === Role.STAFF) {
            return this.orderRepository.findAllWithUser(status);
        }
        return this.orderRepository.findByUserId(userId);
    }

    async getOrderById(orderId: string, userId: string, role: string) {
        const order = await this.orderRepository.findOrderWithItems(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        if (role !== Role.ADMIN && role !== Role.STAFF && order.userId !== userId) {
            throw new Error("Order not found");
        }
        return order;
    }

    async updateOrderStatus(orderId: string, status: string) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        const allowed = ALLOWED_TRANSITIONS[order.status];
        if (!allowed || !allowed.includes(status)) {
            throw new Error(`Cannot transition from ${order.status} to ${status}`);
        }

        return this.orderRepository.update(orderId, { status: status as any });
    }

    async cancelOrder(orderId: string, userId: string) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.userId !== userId) {
            throw new Error("Order not found");
        }
        if (order.status !== "PENDING") {
            throw new Error("Only pending orders can be cancelled");
        }
        return this.orderRepository.update(orderId, { status: "CANCELLED" });
    }
}
