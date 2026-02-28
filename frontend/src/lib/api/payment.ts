/**
 * Payment API Client
 * Handles deposit, QR generation, and payment history
 */

import { apiClient } from './client';

export interface BankInfo {
  bank: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  transferContent: string;
  amount: number;
}

export interface DepositQRResponse {
  qrUrl: string;
  bankInfo: BankInfo;
  expiresAt: string;
}

export interface DepositRequest {
  amount: number;
  method: string;
}

export interface DepositHistory {
  id: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  createdAt: string;
}

export const paymentApi = {
  /**
   * Create deposit request
   */
  createDeposit: async (data: DepositRequest) => {
    return apiClient.post<{
      bankInfo: BankInfo;
      qrUrl: string;
      expiresIn: number;
    }>('/payment/deposit/create', data);
  },

  /**
   * Generate QR code for deposit
   */
  generateQR: async (amount: number) => {
    return apiClient.get<DepositQRResponse>(`/payment/deposit/qr?amount=${amount}`);
  },

  /**
   * Get deposit history
   */
  getHistory: async (limit: number = 10) => {
    return apiClient.get<DepositHistory[]>(`/payment/deposit/history?limit=${limit}`);
  },
};
