import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
export declare class SmmService {
    private orderQueue;
    private prisma;
    private userService;
    constructor(orderQueue: Queue, prisma: PrismaService, userService: UserService);
    placeOrder(userId: string, serviceId: string, quantity: number, targetUrl: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        quantity: number;
        charge: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        providerOrderId: string | null;
        startCount: number;
        remains: number;
        errorResponse: string | null;
        serviceId: string;
        userId: string;
    }>;
    getOrders(userId: string): Promise<({
        service: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            description: string | null;
            minAmount: number;
            maxAmount: number;
            categoryId: string;
            providerId: string;
            providerServiceId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        quantity: number;
        charge: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        providerOrderId: string | null;
        startCount: number;
        remains: number;
        errorResponse: string | null;
        serviceId: string;
        userId: string;
    })[]>;
}
