import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly BANK_INFO: {
    bank: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Load bank info from environment variables
    this.BANK_INFO = {
      bank: this.configService.get('BANK_NAME', 'VietinBank'),
      accountNumber: this.configService.get('BANK_ACCOUNT_NUMBER', '0123456789'),
      accountName: this.configService.get('BANK_ACCOUNT_NAME', 'NGUYEN VAN A'),
      bankCode: this.configService.get('BANK_CODE', 'ICB'),
    };
  }

  /**
   * Generate unique transfer content for deposit
   */
  private generateTransferContent(userId: string): string {
    const shortId = userId.substring(0, 8).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NAP ${shortId}${random}`;
  }

  /**
   * Generate QR code URL for Sepay/VietQR
   */
  private generateQRUrl(amount: number, content: string): string {
    const { accountNumber, accountName, bankCode } = this.BANK_INFO;
    
    // VietQR format: https://img.vietqr.io/image/{BANK}-{ACCOUNT_NO}-{TEMPLATE}.png?amount={AMOUNT}&addInfo={CONTENT}
    const template = 'compact2'; // or 'compact', 'print', 'qr_only'
    const encodedContent = encodeURIComponent(content);
    
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodeURIComponent(accountName)}`;
  }

  /**
   * Create deposit request and return bank info
   */
  async createDepositRequest(userId: string, amount: number, method: string) {
    if (amount < 10000 || amount > 50000000) {
      throw new BadRequestException('Số tiền nạp phải từ 10,000đ đến 50,000,000đ');
    }

    const transferContent = this.generateTransferContent(userId);

    return {
      bankInfo: {
        ...this.BANK_INFO,
        transferContent,
        amount,
      },
      qrUrl: this.generateQRUrl(amount, transferContent),
      expiresIn: 300, // 5 minutes
    };
  }

  /**
   * Generate deposit QR code
   */
  async generateDepositQR(userId: string, amount: number) {
    if (amount < 10000 || amount > 50000000) {
      throw new BadRequestException('Số tiền nạp phải từ 10,000đ đến 50,000,000đ');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const transferContent = this.generateTransferContent(userId);

    return {
      qrUrl: this.generateQRUrl(amount, transferContent),
      bankInfo: {
        ...this.BANK_INFO,
        transferContent,
        amount,
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };
  }

  /**
   * Get deposit history for user
   */
  async getDepositHistory(userId: string, limit: number = 10) {
    const deposits = await this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        transactionId: true,
        createdAt: true,
      },
    });

    return deposits;
  }

  /**
   * Handle Sepay webhook for automatic deposit processing
   */
  async handleSepayWebhook(payload: any, signature: string) {
    // 1. Verify signature
    const expectedSecret = this.configService.get('SEPAY_WEBHOOK_SECRET');
    if (!signature || signature !== expectedSecret) {
      console.error('[Sepay Webhook] Invalid signature', {
        received: signature?.substring(0, 10) + '...',
        expected: expectedSecret?.substring(0, 10) + '...',
      });
      throw new ForbiddenException('Invalid signature');
    }

    // 2. Extract transaction info from Sepay payload
    // Sepay typically sends info like: { content: "NAP 12345", amount: 100000, reference_number: "ABC", ... }
    const content = payload.content || '';
    const amount = Number(payload.amount);
    const transactionId = payload.transaction_id || payload.reference_number;

    // 3. Find User by content (e.g. NAP <userId_numeric>)
    // Regex to match "NAP <some_id>"
    const match = content.match(/NAP\s+(\w+)/i);
    if (!match) return { status: 'IGNORED', message: 'No user reference found' };

    const userRef = match[1];
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: { startsWith: userRef.substring(0, 8) } },
          { username: userRef }
        ]
      },
    });

    if (!user) return { status: 'FAILED', message: 'User not found' };

    // 4. Check if transaction already processed
    const existing = await this.prisma.deposit.findUnique({
      where: { transactionId },
    });
    if (existing) return { status: 'SUCCESS', message: 'Already processed' };

    // 5. Atomic Deposit & Transaction log
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
}
