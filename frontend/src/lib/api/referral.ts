import { apiClient } from './client';

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalSales: number;
  monthlySales: number;
  commissionBalance: number;
  monthlyCommission: number;
  commissionTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  commissionRate: number;
}

export interface CommissionHistory {
  id: string;
  username: string;
  orderType: string;
  orderAmount: number;
  commissionAmount: number;
  commissionRate: number;
  status: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

export interface CommissionTier {
  tier: string;
  minSales: number;
  maxSales: number | null;
  commissionRate: number;
}

export interface CommissionConfig {
  tiers: CommissionTier[];
}

export interface WithdrawalHistory {
  id: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  status: string;
  note: string | null;
  createdAt: string;
  processedAt: string | null;
}

export const referralApi = {
  getReferralCode: async (): Promise<{ referralCode: string }> => {
    return apiClient.get('/referral/code');
  },

  getStats: async (): Promise<ReferralStats> => {
    return apiClient.get('/referral/stats');
  },

  getHistory: async (): Promise<CommissionHistory[]> => {
    return apiClient.get('/referral/history');
  },

  getConfig: async (): Promise<CommissionConfig> => {
    return apiClient.get('/referral/config');
  },

  requestWithdrawal: async (data: WithdrawalRequest) => {
    return apiClient.post('/referral/withdraw', data);
  },

  getWithdrawals: async (): Promise<WithdrawalHistory[]> => {
    return apiClient.get('/referral/withdrawals');
  },
};
