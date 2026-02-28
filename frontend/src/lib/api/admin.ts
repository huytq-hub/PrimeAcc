import { apiClient } from './client';

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalDeposits: number;
  totalOrders: number;
  todayRevenue: number;
  todayOrders: number;
  pendingWithdrawals: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
  commissionBalance: number;
  totalSales: number;
  commissionTier: string;
  referralCode: string | null;
  createdAt: string;
  _count: {
    referrals: number;
    purchases: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  category: { id: string; name: string };
  availableStock: number;
  totalSales: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  oldBalance: number;
  newBalance: number;
  description: string | null;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  status: string;
  note: string | null;
  createdAt: string;
  processedAt: string | null;
  user: {
    username: string;
    email: string;
    commissionBalance: number;
  };
}

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/admin/stats');
    return response.data;
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  updateUserBalance: async (
    userId: string,
    data: { amount: number; type: 'ADD' | 'SUBTRACT'; note?: string }
  ) => {
    const response = await apiClient.put(`/admin/users/${userId}/balance`, data);
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'MEMBER' | 'AGENT' | 'ADMIN') => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/admin/products');
    return response.data;
  },

  createProduct: async (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }) => {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
  },

  updateProduct: async (
    productId: string,
    data: { name?: string; description?: string; price?: number }
  ) => {
    const response = await apiClient.put(`/admin/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  },

  addStock: async (productId: string, content: string) => {
    const response = await apiClient.post(`/admin/products/${productId}/stock`, { content });
    return response.data;
  },

  addBulkStock: async (productId: string, stocks: string[]) => {
    const response = await apiClient.post(`/admin/products/${productId}/stock/bulk`, { stocks });
    return response.data;
  },

  // Transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{ transactions: Transaction[]; total: number; page: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/transactions', { params });
    return response.data;
  },

  // Withdrawals
  getWithdrawals: async (status?: string): Promise<Withdrawal[]> => {
    const url = status ? `/admin/withdrawals?status=${status}` : '/admin/withdrawals';
    return apiClient.get(url);
  },

  approveWithdrawal: async (withdrawalId: string) => {
    return apiClient.put(`/admin/withdrawals/${withdrawalId}/approve`, {});
  },

  completeWithdrawal: async (withdrawalId: string) => {
    return apiClient.put(`/admin/withdrawals/${withdrawalId}/complete`, {});
  },

  rejectWithdrawal: async (withdrawalId: string, note?: string) => {
    return apiClient.put(`/admin/withdrawals/${withdrawalId}/reject`, { note });
  },
};
