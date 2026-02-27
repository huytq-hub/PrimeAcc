import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Processor('smm-orders')
export class SmmProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { orderId } = job.data;
    const order = await this.prisma.smmOrder.findUnique({
      where: { id: orderId },
      include: { service: { include: { provider: true } } },
    });

    if (!order) return;

    try {
      // Mocking API call to Provider (e.g. Perfect Panel API)
      const provider = order.service.provider;
      
      // Real implementation would look like this:
      /*
      const response = await axios.post(provider.apiUrl, {
        key: provider.apiKey,
        action: 'add',
        service: order.service.providerServiceId,
        link: order.targetUrl,
        quantity: order.quantity
      });
      */

      // Mocking successful provider response
      const providerOrderId = `MOCKED_${Math.random().toString(36).substring(7)}`;

      await this.prisma.smmOrder.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
          providerOrderId,
        },
      });

      console.log(`Order ${orderId} processed successfully with provider ID ${providerOrderId}`);
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error.message);
      
      await this.prisma.smmOrder.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          errorResponse: error.message,
        },
      });

      // Would also need to refund balance here!
    }
  }
}
