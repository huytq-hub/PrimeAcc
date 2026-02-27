import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(username: string, email: string, pass: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        balance: import("@prisma/client-runtime-utils").Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(username: string, pass: string): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            balance: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
}
