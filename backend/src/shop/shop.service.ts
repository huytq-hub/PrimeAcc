import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async buyAccount(userId: string, productId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get product and check price
      const product = await tx.accountProduct.findUnique({
        where: { id: productId },
      });
      if (!product) throw new BadRequestException('Product not found');

      // 2. Lock Stock Logic: Find one available stock and mark it as locked
      const stock = await tx.accountStock.findFirst({
        where: {
          productId,
          isSold: false,
          OR: [
            { lockedAt: null },
            { lockedAt: { lt: new Date(Date.now() - 5 * 60 * 1000) } }, // Unlock after 5 mins
          ],
        },
      });

      if (!stock) throw new ConflictException('Out of stock');

      // Lock it temporarily
      await tx.accountStock.update({
        where: { id: stock.id },
        data: { lockedAt: new Date() },
      });

      // 3. Check and deduct balance
      const price = Number(product.price);
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      if (Number(user.balance) < price) {
        throw new BadRequestException('Insufficient balance');
      }

      // Update balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: price } },
      });

      // 4. Create Purchase Record
      const purchase = await tx.accountPurchase.create({
        data: {
          userId,
          productId,
          price,
        },
      });

      // 5. Finalize Stock
      await tx.accountStock.update({
        where: { id: stock.id },
        data: {
          isSold: true,
          soldAt: new Date(),
          purchaseId: purchase.id,
          lockedAt: null,
        },
      });

      // 6. Log transaction
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

  async getPurchases(userId: string) {
    return this.prisma.accountPurchase.findMany({
      where: { userId },
      include: { product: true, stock: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
