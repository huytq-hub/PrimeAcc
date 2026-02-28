import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(
      body.username, 
      body.email, 
      body.password,
      body.referralCode, // Optional referral code
    );
  }

  @Throttle({ default: { limit: 5, ttl: 60 } }) // Limit 5 login attempts per minute
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Return full user object with id, username, email, role, balance
    // Convert Decimal to number for balance
    return {
      id: req.user.userId,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      balance: req.user.balance ? Number(req.user.balance) : 0
    };
  }
}
