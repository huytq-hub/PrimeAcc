import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        balance: import("@prisma/client-runtime-utils").Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            balance: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    getProfile(req: any): any;
}
