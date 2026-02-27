import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
export declare class ShopService {
    private prisma;
    private userService;
    constructor(prisma: PrismaService, userService: UserService);
    buyAccount(userId: string, productId: string): Promise<{
        purchaseId: string;
        accountData: string;
    }>;
    getPurchases(userId: string): Promise<({
        product: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            description: string | null;
            categoryId: string;
        };
        stock: {
            id: string;
            productId: string;
            purchaseId: string | null;
            content: string;
            isSold: boolean;
            lockedAt: Date | null;
            soldAt: Date | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        productId: string;
    })[]>;
}
