"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let TelegramService = class TelegramService {
    configService;
    botToken;
    chatId;
    constructor(configService) {
        this.configService = configService;
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
        this.chatId = this.configService.get('TELEGRAM_CHAT_ID') || '';
    }
    async sendMessage(message) {
        if (!this.botToken || !this.chatId)
            return;
        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            await axios_1.default.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML',
            });
        }
        catch (error) {
            console.error('Telegram Notify Error:', error.message);
        }
    }
    async notifyOrder(order) {
        const text = `📦 <b>New SMM Order</b>\nID: #${order.id}\nUser: ${order.userId}\nService: ${order.service.name}\nQty: ${order.quantity}\nCharge: $${order.charge}`;
        await this.sendMessage(text);
    }
    async notifyDeposit(deposit) {
        const text = `💰 <b>New Deposit</b>\nUser: ${deposit.userId}\nAmount: $${deposit.amount}\nMethod: ${deposit.method}`;
        await this.sendMessage(text);
    }
    async notifyError(source, error) {
        const text = `⚠️ <b>System Error</b>\nSource: ${source}\nError: ${error}`;
        await this.sendMessage(text);
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map