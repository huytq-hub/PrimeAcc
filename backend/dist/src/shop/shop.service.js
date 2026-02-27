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
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
let ShopService = class ShopService {
    prisma;
    userService;
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
    }
    async buyAccount(userId, productId) {
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.accountProduct.findUnique({
                where: { id: productId },
            });
            if (!product)
                throw new common_1.BadRequestException('Product not found');
            const stock = await tx.accountStock.findFirst({
                where: {
                    productId,
                    isSold: false,
                    OR: [
                        { lockedAt: null },
                        { lockedAt: { lt: new Date(Date.now() - 5 * 60 * 1000) } },
                    ],
                },
            });
            if (!stock)
                throw new common_1.ConflictException('Out of stock');
            await tx.accountStock.update({
                where: { id: stock.id },
                data: { lockedAt: new Date() },
            });
            const price = Number(product.price);
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.BadRequestException('User not found');
            if (Number(user.balance) < price) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: price } },
            });
            const purchase = await tx.accountPurchase.create({
                data: {
                    userId,
                    productId,
                    price,
                },
            });
            await tx.accountStock.update({
                where: { id: stock.id },
                data: {
                    isSold: true,
                    soldAt: new Date(),
                    purchaseId: purchase.id,
                    lockedAt: null,
                },
            });
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'ACCOUNT_PURCHASE',
                    amount: price,
                    oldBalance: user.balance,
                    newBalance: Number(user.balance) - price,
                    description: `Purchase account for ${product.name}`,
                    referenceId: purchase.id,
                },
            });
            return {
                purchaseId: purchase.id,
                accountData: stock.content,
            };
        });
    }
    async getPurchases(userId) {
        return this.prisma.accountPurchase.findMany({
            where: { userId },
            include: { product: true, stock: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService])
], ShopService);
//# sourceMappingURL=shop.service.js.map