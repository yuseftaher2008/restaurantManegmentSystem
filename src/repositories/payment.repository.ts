import { prisma } from "../../lib/prisma";
import type { Payment } from "../../generated/prisma/client";
import type { PaymentUncheckedCreateInput, PaymentUpdateInput } from "../../generated/prisma/models/Payment";
import { BaseRepository } from "./base.repository";

export class PaymentRepository extends BaseRepository<Payment, PaymentUncheckedCreateInput, PaymentUpdateInput> {

    constructor() {
        super(prisma.payment);
    }

    async findByOrderId(orderId: string): Promise<Payment | null> {
        return prisma.payment.findUnique({
            where: { orderId },
        });
    }

    async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
        return prisma.payment.findFirst({
            where: { transactionReference },
        });
    }
}
