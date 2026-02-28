import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('products')
  async getProducts() {
    return this.shopService.getProducts();
  }

  @Get('categories')
  async getCategories() {
    return this.shopService.getCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  async buyAccount(@Request() req, @Body() body: { productId: string }) {
    return this.shopService.buyAccount(req.user.userId, body.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchases')
  async getPurchases(@Request() req) {
    return this.shopService.getPurchases(req.user.userId);
  }
}
