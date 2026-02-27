import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    handleSepayWebhook(payload: any, signature: string): Promise<{
        status: string;
        userId: string;
        amount: number;
    } | {
        status: string;
        message: string;
    }>;
}
