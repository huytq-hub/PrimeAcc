import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
  }

  async sendMessage(message: string) {
    if (!this.botToken || !this.chatId) return;

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Telegram Notify Error:', error.message);
    }
  }

  async notifyOrder(order: any) {
    const text = `📦 <b>New SMM Order</b>\nID: #${order.id}\nUser: ${order.userId}\nService: ${order.service.name}\nQty: ${order.quantity}\nCharge: $${order.charge}`;
    await this.sendMessage(text);
  }

  async notifyDeposit(deposit: any) {
    const text = `💰 <b>New Deposit</b>\nUser: ${deposit.userId}\nAmount: $${deposit.amount}\nMethod: ${deposit.method}`;
    await this.sendMessage(text);
  }

  async notifyError(source: string, error: string) {
    const text = `⚠️ <b>System Error</b>\nSource: ${source}\nError: ${error}`;
    await this.sendMessage(text);
  }
}
