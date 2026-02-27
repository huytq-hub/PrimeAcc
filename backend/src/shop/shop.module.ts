import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ShopService],
  controllers: [ShopController]
})
export class ShopModule {}
