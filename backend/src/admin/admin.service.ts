import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalRevenue,
      totalDeposits,
      totalOrders,
      todayRevenue,
      todayOrders,
      pendingWithdrawals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.transaction.aggregate({
        where: { type: { in: ['ACCOUNT_PURCHASE', 'SMM_ORDER'] } },
        _sum: { amount: true },
      }),
      this.prisma.deposit.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.accountPurchase.count(),
      this.prisma.transaction.aggregate({
        where: {
          type: { in: ['ACCOUNT_PURCHASE', 'SMM_ORDER'] },
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { amount: true },
      }),
      this.prisma.accountPurchase.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      this.prisma.commissionWithdrawal.count({
        where: { status: 'PENDING' },
      }),
    ]);

    return {
      totalUsers,
      totalRevenue: Number(totalRevenue._sum.amount || 0),
      totalDeposits: Number(totalDeposits._sum.amount || 0),
      totalOrders,
      todayRevenue: Number(todayRevenue._sum.amount || 0),
      todayOrders,
      pendingWithdrawals,
    };
  }

  async getUsers(page: number, limit: number, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          balance: true,
          commissionBalance: true,
          totalSales: true,
          commissionTier: true,
          referralCode: true,
          createdAt: true,
          _count: {
            select: {
              referrals: true,
              purchases: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        balance: Number(u.balance),
        commissionBalance: Number(u.commissionBalance),
        totalSales: Number(u.totalSales),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserBalance(
    userId: string,
    amount: number,
    type: 'ADD' | 'SUBTRACT',
    note?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      const oldBalance = Number(user.balance);
      const newBalance = type === 'ADD' ? oldBalance + amount : oldBalance - amount;

      if (newBalance < 0) throw new BadRequestException('Insufficient balance');

      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: type === 'ADD' ? 'DEPOSIT' : 'REFUND',
          amount,
          oldBalance,
          newBalance,
          description: note || `Admin ${type.toLowerCase()} balance`,
        },
      });

      return { success: true, newBalance };
    });
  }

  async updateUserRole(userId: string, role: 'MEMBER' | 'AGENT' | 'ADMIN') {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true },
    });

    return user;
  }

  async getProducts() {
    const products = await this.prisma.accountProduct.findMany({
      include: {
        category: true,
        _count: {
          select: {
            stocks: {
              where: { isSold: false },
            },
            purchases: true,
          },
        },
      },
    });

    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      availableStock: p._count.stocks,
      totalSales: p._count.purchases,
    }));
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }) {
    const product = await this.prisma.accountProduct.create({
      data,
      include: { category: true },
    });

    return { ...product, price: Number(product.price) };
  }

  async updateProduct(
    productId: string,
    data: { name?: string; description?: string; price?: number },
  ) {
    const product = await this.prisma.accountProduct.update({
      where: { id: productId },
      data,
      include: { category: true },
    });

    return { ...product, price: Number(product.price) };
  }

  async deleteProduct(productId: string) {
    // Check if product has unsold stock
    const unsoldStock = await this.prisma.accountStock.count({
      where: { productId, isSold: false },
    });

    if (unsoldStock > 0) {
      throw new BadRequestException(
        `Cannot delete product with ${unsoldStock} unsold stock items`,
      );
    }

    await this.prisma.accountProduct.delete({
      where: { id: productId },
    });

    return { success: true };
  }

  async addStock(productId: string, content: string) {
    const stock = await this.prisma.accountStock.create({
      data: {
        productId,
        content,
      },
    });

    return stock;
  }

  async addBulkStock(productId: string, stocks: string[]) {
    const created = await this.prisma.accountStock.createMany({
      data: stocks.map((content) => ({
        productId,
        content,
      })),
    });

    return { created: created.count };
  }

  async getTransactions(page: number, limit: number, type?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { username: true, email: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        oldBalance: Number(t.oldBalance),
        newBalance: Number(t.newBalance),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCommissions(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [commissions, total] = await Promise.all([
      this.prisma.commission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          agent: {
            select: { username: true, email: true },
          },
          referredUser: {
            select: { username: true, email: true },
          },
        },
      }),
      this.prisma.commission.count({ where }),
    ]);

    return {
      commissions: commissions.map((c) => ({
        ...c,
        orderAmount: Number(c.orderAmount),
        commissionRate: Number(c.commissionRate),
        commissionAmount: Number(c.commissionAmount),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getWithdrawals(status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const withdrawals = await this.prisma.commissionWithdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, email: true, commissionBalance: true },
        },
      },
    });

    return withdrawals.map((w) => ({
      ...w,
      amount: Number(w.amount),
      user: {
        ...w.user,
        commissionBalance: Number(w.user.commissionBalance),
      },
    }));
  }

  async updateWithdrawalStatus(
    withdrawalId: string,
    status: 'APPROVED' | 'COMPLETED' | 'REJECTED',
    note?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.commissionWithdrawal.findUnique({
        where: { id: withdrawalId },
        include: { user: true },
      });

      if (!withdrawal) throw new BadRequestException('Withdrawal not found');

      // If rejecting, refund commission balance
      if (status === 'REJECTED' && withdrawal.status === 'PENDING') {
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            commissionBalance: {
              increment: withdrawal.amount,
            },
          },
        });
      }

      const updated = await tx.commissionWithdrawal.update({
        where: { id: withdrawalId },
        data: {
          status,
          processedAt: new Date(),
          note,
        },
      });

      return { ...updated, amount: Number(updated.amount) };
    });
  }
}
