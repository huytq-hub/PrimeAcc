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
    return apiClient.get<DashboardStats>('/admin/stats');
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
    return apiClient.get(endpoint);
  },

  updateUserBalance: async (
    userId: string,
    data: { amount: number; type: 'ADD' | 'SUBTRACT'; note?: string }
  ) => {
    return apiClient.put(`/admin/users/${userId}/balance`, data);
  },

  updateUserRole: async (userId: string, role: 'MEMBER' | 'AGENT' | 'ADMIN') => {
    return apiClient.put(`/admin/users/${userId}/role`, { role });
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/admin/products');
  },

  createProduct: async (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }) => {
    return apiClient.post('/admin/products', data);
  },

  updateProduct: async (
    productId: string,
    data: { name?: string; description?: string; price?: number }
  ) => {
    return apiClient.put(`/admin/products/${productId}`, data);
  },

  deleteProduct: async (productId: string) => {
    return apiClient.delete(`/admin/products/${productId}`);
  },

  addStock: async (productId: string, content: string) => {
    return apiClient.post(`/admin/products/${productId}/stock`, { content });
  },

  addBulkStock: async (productId: string, stocks: string[]) => {
    return apiClient.post(`/admin/products/${productId}/stock/bulk`, { stocks });
  },

  // Transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{ transactions: Transaction[]; total: number; page: number; totalPages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/transactions?${queryString}` : '/admin/transactions';
    
    return apiClient.get(endpoint);
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
