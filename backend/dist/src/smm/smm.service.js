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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmmService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
let SmmService = class SmmService {
    orderQueue;
    prisma;
    userService;
    constructor(orderQueue, prisma, userService) {
        this.orderQueue = orderQueue;
        this.prisma = prisma;
        this.userService = userService;
    }
    async placeOrder(userId, serviceId, quantity, targetUrl) {
        const service = await this.prisma.smmService.findUnique({
            where: { id: serviceId },
        });
        if (!service)
            throw new common_1.BadRequestException('Service not found');
        if (quantity < service.minAmount || quantity > service.maxAmount) {
            throw new common_1.BadRequestException(`Quantity must be between ${service.minAmount} and ${service.maxAmount}`);
        }
        const totalCharge = Number(service.price) * (quantity / 1000);
        await this.userService.updateBalance(userId, totalCharge, 'SUBTRACT');
        const order = await this.prisma.smmOrder.create({
            data: {
                userId,
                serviceId,
                quantity,
                targetUrl,
                charge: totalCharge,
                status: 'PENDING',
            },
        });
        await this.prisma.transaction.create({
            data: {
                userId,
                type: 'SMM_ORDER',
                amount: totalCharge,
                oldBalance: 0,
                newBalance: 0,
                description: `Order #${order.id} for ${service.name}`,
                referenceId: order.id,
            },
        });
        await this.orderQueue.add('process-smm-order', { orderId: order.id });
        return order;
    }
    async getOrders(userId) {
        return this.prisma.smmOrder.findMany({
            where: { userId },
            include: { service: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SmmService = SmmService;
exports.SmmService = SmmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('smm-orders')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService,
        user_service_1.UserService])
], SmmService);
//# sourceMappingURL=smm.service.js.map