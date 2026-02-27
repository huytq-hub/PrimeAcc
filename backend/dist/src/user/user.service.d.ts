import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(username: string): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        balance: Prisma.Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        balance: Prisma.Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        balance: Prisma.Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBalance(userId: string, amount: number, type: 'ADD' | 'SUBTRACT'): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        balance: Prisma.Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
