import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from '../user/user.module';
import { ReferralModule } from '../referral/referral.module';

@Module({
  imports: [UserModule, ReferralModule],
  providers: [ShopService],
  controllers: [ShopController]
})
export class ShopModule {}
