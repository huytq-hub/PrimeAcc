import { ConfigService } from '@nestjs/config';
export declare class TelegramService {
    private configService;
    private botToken;
    private chatId;
    constructor(configService: ConfigService);
    sendMessage(message: string): Promise<void>;
    notifyOrder(order: any): Promise<void>;
    notifyDeposit(deposit: any): Promise<void>;
    notifyError(source: string, error: string): Promise<void>;
}
