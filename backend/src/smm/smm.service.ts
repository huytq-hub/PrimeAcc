import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SmmService {
  constructor(
    @InjectQueue('smm-orders') private orderQueue: Queue,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async placeOrder(userId: string, serviceId: string, quantity: number, targetUrl: string) {
    const service = await this.prisma.smmService.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new BadRequestException('Service not found');
    if (quantity < service.minAmount || quantity > service.maxAmount) {
      throw new BadRequestException(`Quantity must be between ${service.minAmount} and ${service.maxAmount}`);
    }

    const totalCharge = Number(service.price) * (quantity / 1000); // Usually price is per 1000

    // Deduct balance with transaction and negative check
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

    // Logging transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'SMM_ORDER',
        amount: totalCharge,
        oldBalance: 0, // Should be calculated but for now simple
        newBalance: 0,
        description: `Order #${order.id} for ${service.name}`,
        referenceId: order.id,
      },
    });

    // Add to BulMQ queue
    await this.orderQueue.add('process-smm-order', { orderId: order.id });

    return order;
  }

  async getOrders(userId: string) {
    return this.prisma.smmOrder.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
