import { Controller, Post, Body, Headers, Get, Query, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('sepay/webhook')
  async handleSepayWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Headers('authorization') authorization: string,
  ) {
    // Sepay có thể gửi signature qua x-signature hoặc authorization header
    const authSignature = signature || authorization?.replace('Apikey ', '');
    return this.paymentService.handleSepayWebhook(payload, authSignature);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit/create')
  async createDeposit(
    @Request() req,
    @Body() body: { amount: number; method: string },
  ) {
    return this.paymentService.createDepositRequest(req.user.userId, body.amount, body.method);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deposit/history')
  async getDepositHistory(@Request() req, @Query('limit') limit?: string) {
    return this.paymentService.getDepositHistory(req.user.userId, limit ? parseInt(limit) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deposit/qr')
  async getDepositQR(
    @Request() req,
    @Query('amount') amount: string,
  ) {
    return this.paymentService.generateDepositQR(req.user.userId, parseInt(amount));
  }
}
