import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: any): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        balance: import("@prisma/client-runtime-utils").Decimal;
        pricingTier: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
