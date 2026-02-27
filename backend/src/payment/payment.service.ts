import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async handleSepayWebhook(payload: any, signature: string) {
    // 1. Verify signature (Simulated for this demo)
    /*
    const expectedSecret = this.configService.get('SEPAY_WEBHOOK_SECRET');
    if (signature !== expectedSecret) {
      throw new ForbiddenException('Invalid signature');
    }
    */

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
          { id: userRef },
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
