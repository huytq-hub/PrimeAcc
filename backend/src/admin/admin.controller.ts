import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard Stats
  @Get('stats')
  async getDashboardStats(@GetUser() user: any) {
    this.checkAdmin(user);
    return this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  async getUsers(
    @GetUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    this.checkAdmin(user);
    return this.adminService.getUsers(
      parseInt(page),
      parseInt(limit),
      search,
      role,
    );
  }

  @Put('users/:id/balance')
  async updateUserBalance(
    @GetUser() user: any,
    @Param('id') userId: string,
    @Body() body: { amount: number; type: 'ADD' | 'SUBTRACT'; note?: string },
  ) {
    this.checkAdmin(user);
    return this.adminService.updateUserBalance(userId, body.amount, body.type, body.note);
  }

  @Put('users/:id/role')
  async updateUserRole(
    @GetUser() user: any,
    @Param('id') userId: string,
    @Body() body: { role: 'MEMBER' | 'AGENT' | 'ADMIN' },
  ) {
    this.checkAdmin(user);
    return this.adminService.updateUserRole(userId, body.role);
  }

  // Product Management
  @Get('products')
  async getProducts(@GetUser() user: any) {
    this.checkAdmin(user);
    return this.adminService.getProducts();
  }

  @Post('products')
  async createProduct(
    @GetUser() user: any,
    @Body() body: { name: string; description?: string; price: number; categoryId: string },
  ) {
    this.checkAdmin(user);
    return this.adminService.createProduct(body);
  }

  @Put('products/:id')
  async updateProduct(
    @GetUser() user: any,
    @Param('id') productId: string,
    @Body() body: { name?: string; description?: string; price?: number },
  ) {
    this.checkAdmin(user);
    return this.adminService.updateProduct(productId, body);
  }

  @Delete('products/:id')
  async deleteProduct(@GetUser() user: any, @Param('id') productId: string) {
    this.checkAdmin(user);
    return this.adminService.deleteProduct(productId);
  }

  // Stock Management
  @Post('products/:id/stock')
  async addStock(
    @GetUser() user: any,
    @Param('id') productId: string,
    @Body() body: { content: string },
  ) {
    this.checkAdmin(user);
    return this.adminService.addStock(productId, body.content);
  }

  @Post('products/:id/stock/bulk')
  async addBulkStock(
    @GetUser() user: any,
    @Param('id') productId: string,
    @Body() body: { stocks: string[] },
  ) {
    this.checkAdmin(user);
    return this.adminService.addBulkStock(productId, body.stocks);
  }

  // Transaction Management
  @Get('transactions')
  async getTransactions(
    @GetUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('type') type?: string,
  ) {
    this.checkAdmin(user);
    return this.adminService.getTransactions(parseInt(page), parseInt(limit), type);
  }

  // Commission Management
  @Get('commissions')
  async getCommissions(
    @GetUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('status') status?: string,
  ) {
    this.checkAdmin(user);
    return this.adminService.getCommissions(parseInt(page), parseInt(limit), status);
  }

  @Get('withdrawals')
  async getWithdrawals(
    @GetUser() user: any,
    @Query('status') status?: string,
  ) {
    this.checkAdmin(user);
    return this.adminService.getWithdrawals(status);
  }

  @Get('withdrawals/debug')
  async debugWithdrawals(@GetUser() user: any) {
    this.checkAdmin(user);
    // Return all withdrawals with full details for debugging
    const all = await this.adminService.getWithdrawals();
    const pending = await this.adminService.getWithdrawals('PENDING');
    return {
      total: all.length,
      pending: pending.length,
      allWithdrawals: all,
    };
  }

  @Put('withdrawals/:id/approve')
  async approveWithdrawal(@GetUser() user: any, @Param('id') withdrawalId: string) {
    this.checkAdmin(user);
    return this.adminService.updateWithdrawalStatus(withdrawalId, 'APPROVED');
  }

  @Put('withdrawals/:id/complete')
  async completeWithdrawal(@GetUser() user: any, @Param('id') withdrawalId: string) {
    this.checkAdmin(user);
    return this.adminService.updateWithdrawalStatus(withdrawalId, 'COMPLETED');
  }

  @Put('withdrawals/:id/reject')
  async rejectWithdrawal(
    @GetUser() user: any,
    @Param('id') withdrawalId: string,
    @Body() body: { note?: string },
  ) {
    this.checkAdmin(user);
    return this.adminService.updateWithdrawalStatus(withdrawalId, 'REJECTED', body.note);
  }

  private checkAdmin(user: any) {
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required');
    }
  }
}
