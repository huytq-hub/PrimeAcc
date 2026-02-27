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
exports.SmmProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
let SmmProcessor = class SmmProcessor extends bullmq_1.WorkerHost {
    prisma;
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { orderId } = job.data;
        const order = await this.prisma.smmOrder.findUnique({
            where: { id: orderId },
            include: { service: { include: { provider: true } } },
        });
        if (!order)
            return;
        try {
            const provider = order.service.provider;
            const providerOrderId = `MOCKED_${Math.random().toString(36).substring(7)}`;
            await this.prisma.smmOrder.update({
                where: { id: orderId },
                data: {
                    status: 'PROCESSING',
                    providerOrderId,
                },
            });
            console.log(`Order ${orderId} processed successfully with provider ID ${providerOrderId}`);
        }
        catch (error) {
            console.error(`Error processing order ${orderId}:`, error.message);
            await this.prisma.smmOrder.update({
                where: { id: orderId },
                data: {
                    status: 'CANCELLED',
                    errorResponse: error.message,
                },
            });
        }
    }
};
exports.SmmProcessor = SmmProcessor;
exports.SmmProcessor = SmmProcessor = __decorate([
    (0, bullmq_1.Processor)('smm-orders'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmmProcessor);
//# sourceMappingURL=smm.processor.js.map