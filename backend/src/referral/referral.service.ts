import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionTier } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Get commission rates from environment
  private getCommissionRates() {
    return {
      BRONZE: this.configService.get<number>('COMMISSION_RATE_BRONZE', 10),
      SILVER: this.configService.get<number>('COMMISSION_RATE_SILVER', 15),
      GOLD: this.configService.get<number>('COMMISSION_RATE_GOLD', 18),
      DIAMOND: this.configService.get<number>('COMMISSION_RATE_DIAMOND', 20),
    };
  }

  // Get tier thresholds from environment
  private getTierThresholds() {
    return {
      SILVER: this.configService.get<number>('COMMISSION_TIER_SILVER_THRESHOLD', 10_000_000),
      GOLD: this.configService.get<number>('COMMISSION_TIER_GOLD_THRESHOLD', 50_000_000),
      DIAMOND: this.configService.get<number>('COMMISSION_TIER_DIAMOND_THRESHOLD', 100_000_000),
    };
  }

  // Generate unique referral code
  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (user.referralCode) return user.referralCode;

    // Generate code: First 3 letters of username + random 6 chars
    const prefix = user.username.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}${random}`;

    // Check uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { referralCode: code },
    });

    if (existing) {
      // Retry with different random
      return this.generateReferralCode(userId);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });

    return code;
  }

  // Get commission rate based on tier
  getCommissionRate(tier: CommissionTier): number {
    const rates = this.getCommissionRates();
    return rates[tier] || rates.BRONZE;
  }

  // Calculate tier based on total sales
  calculateTier(totalSales: number): CommissionTier {
    const thresholds = this.getTierThresholds();
    
    if (totalSales >= thresholds.DIAMOND) return 'DIAMOND';
    if (totalSales >= thresholds.GOLD) return 'GOLD';
    if (totalSales >= thresholds.SILVER) return 'SILVER';
    return 'BRONZE';
  }

  // Create commission record
  async createCommission(data: {
    agentId: string;
    referredUserId: string;
    orderId?: string;
    purchaseId?: string;
    orderType: string;
    orderAmount: number;
  }) {
    const agent = await this.prisma.user.findUnique({
      where: { id: data.agentId },
    });

    if (!agent) throw new BadRequestException('Agent not found');

    const rate = this.getCommissionRate(agent.commissionTier);
    const commissionAmount = (data.orderAmount * rate) / 100;

    const commission = await this.prisma.commission.create({
      data: {
        agentId: data.agentId,
        referredUserId: data.referredUserId,
        orderId: data.orderId,
        purchaseId: data.purchaseId,
        orderType: data.orderType,
        orderAmount: data.orderAmount,
        commissionRate: rate,
        commissionAmount,
        status: 'APPROVED', // Auto-approve for now
      },
    });

    // Update agent's commission balance and total sales
    const newTotalSales = Number(agent.totalSales) + data.orderAmount;
    const newTier = this.calculateTier(newTotalSales);

    await this.prisma.user.update({
      where: { id: data.agentId },
      data: {
        commissionBalance: {
          increment: commissionAmount,
        },
        totalSales: newTotalSales,
        commissionTier: newTier,
      },
    });

    return commission;
  }

  // Get referral stats
  async getReferralStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: true,
        commissionsEarned: {
          where: { status: 'APPROVED' },
        },
      },
    });

    if (!user) throw new BadRequestException('User not found');

    // Auto-generate referral code if not exists
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = await this.generateReferralCode(userId);
    }

    const totalReferrals = user.referrals.length;
    const totalCommissions = user.commissionsEarned.reduce(
      (sum, c) => sum + Number(c.commissionAmount),
      0,
    );

    // Calculate this month's sales
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyCommissions = await this.prisma.commission.findMany({
      where: {
        agentId: userId,
        status: 'APPROVED',
        createdAt: { gte: startOfMonth },
      },
    });

    const monthlySales = monthlyCommissions.reduce(
      (sum, c) => sum + Number(c.orderAmount),
      0,
    );

    const monthlyCommissionAmount = monthlyCommissions.reduce(
      (sum, c) => sum + Number(c.commissionAmount),
      0,
    );

    return {
      referralCode,
      totalReferrals,
      totalSales: Number(user.totalSales),
      monthlySales,
      commissionBalance: Number(user.commissionBalance),
      monthlyCommission: monthlyCommissionAmount,
      commissionTier: user.commissionTier,
      commissionRate: this.getCommissionRate(user.commissionTier),
    };
  }

  // Get commission history
  async getCommissionHistory(userId: string, limit = 20) {
    const commissions = await this.prisma.commission.findMany({
      where: { agentId: userId },
      include: {
        referredUser: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return commissions.map((c) => ({
      id: c.id,
      username: c.referredUser.username,
      orderType: c.orderType,
      orderAmount: Number(c.orderAmount),
      commissionAmount: Number(c.commissionAmount),
      commissionRate: Number(c.commissionRate),
      status: c.status,
      createdAt: c.createdAt,
    }));
  }

  // Request withdrawal
  async requestWithdrawal(
    userId: string,
    data: {
      amount: number;
      bankName: string;
      bankAccount: string;
      bankAccountName: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (Number(user.commissionBalance) < data.amount) {
      throw new BadRequestException('Insufficient commission balance');
    }

    const withdrawal = await this.prisma.commissionWithdrawal.create({
      data: {
        userId,
        amount: data.amount,
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        bankAccountName: data.bankAccountName,
        status: 'PENDING',
      },
    });

    // Deduct from commission balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        commissionBalance: {
          decrement: data.amount,
        },
      },
    });

    return withdrawal;
  }

  // Get commission configuration
  getCommissionConfig() {
    const rates = this.getCommissionRates();
    const thresholds = this.getTierThresholds();

    return {
      tiers: [
        {
          tier: 'BRONZE',
          minSales: 0,
          maxSales: thresholds.SILVER - 1,
          commissionRate: rates.BRONZE,
        },
        {
          tier: 'SILVER',
          minSales: thresholds.SILVER,
          maxSales: thresholds.GOLD - 1,
          commissionRate: rates.SILVER,
        },
        {
          tier: 'GOLD',
          minSales: thresholds.GOLD,
          maxSales: thresholds.DIAMOND - 1,
          commissionRate: rates.GOLD,
        },
        {
          tier: 'DIAMOND',
          minSales: thresholds.DIAMOND,
          maxSales: null,
          commissionRate: rates.DIAMOND,
        },
      ],
    };
  }

  // Get user's withdrawal history
  async getWithdrawals(userId: string) {
    const withdrawals = await this.prisma.commissionWithdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return withdrawals.map((w) => ({
      id: w.id,
      amount: Number(w.amount),
      bankName: w.bankName,
      bankAccount: w.bankAccount,
      bankAccountName: w.bankAccountName,
      status: w.status,
      note: w.note,
      createdAt: w.createdAt,
      processedAt: w.processedAt,
    }));
  }
}
