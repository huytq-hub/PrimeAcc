import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('referral')
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('code')
  async getReferralCode(@Request() req) {
    const code = await this.referralService.generateReferralCode(req.user.userId);
    return { referralCode: code };
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.referralService.getReferralStats(req.user.userId);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.referralService.getCommissionHistory(req.user.userId);
  }

  @Get('config')
  async getConfig() {
    return this.referralService.getCommissionConfig();
  }

  @Post('withdraw')
  async requestWithdrawal(@Request() req, @Body() body) {
    return this.referralService.requestWithdrawal(req.user.userId, body);
  }

  @Get('withdrawals')
  async getWithdrawals(@Request() req) {
    return this.referralService.getWithdrawals(req.user.userId);
  }
}
