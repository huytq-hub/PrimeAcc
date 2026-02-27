"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let PaymentService = class PaymentService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async handleSepayWebhook(payload, signature) {
        const content = payload.content || '';
        const amount = Number(payload.amount);
        const transactionId = payload.transaction_id || payload.reference_number;
        const match = content.match(/NAP\s+(\w+)/i);
        if (!match)
            return { status: 'IGNORED', message: 'No user reference found' };
        const userRef = match[1];
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: userRef },
                    { username: userRef }
                ]
            },
        });
        if (!user)
            return { status: 'FAILED', message: 'User not found' };
        const existing = await this.prisma.deposit.findUnique({
            where: { transactionId },
        });
        if (existing)
            return { status: 'SUCCESS', message: 'Already processed' };
        return this.prisma.$transaction(async (tx) => {
            const oldBalance = Number(user.balance);
            const newBalance = oldBalance + amount;
            await tx.user.update({
                where: { id: user.id },
                data: { balance: newBalance },
            });
            const deposit = await tx.deposit.create({
                data: {
                    userId: user.id,
                    amount,
                    method: 'SEPAY',
                    transactionId,
                    status: 'COMPLETED',
                },
            });
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: 'DEPOSIT',
                    amount,
                    oldBalance,
                    newBalance,
                    description: `Sepay deposit #${transactionId}`,
                    referenceId: deposit.id,
                },
            });
            return { status: 'SUCCESS', userId: user.id, amount };
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map