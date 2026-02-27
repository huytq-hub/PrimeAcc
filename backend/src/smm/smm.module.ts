import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmmService } from './smm.service';
import { SmmController } from './smm.controller';
import { SmmProcessor } from './smm.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'smm-orders',
    }),
  ],
  providers: [SmmService, SmmProcessor],
  controllers: [SmmController],
})
export class SmmModule {}
