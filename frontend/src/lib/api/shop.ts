import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  categoryId: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

export interface Purchase {
  id: string;
  productId: string;
  price: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description: string | null;
  };
  stock: {
    id: string;
    content: string;
  } | null;
}

export interface BuyAccountResponse {
  purchaseId: string;
  accountData: string;
}

export const shopApi = {
  getProducts: async (): Promise<Product[]> => {
    return apiClient.get('/shop/products');
  },

  getCategories: async (): Promise<Category[]> => {
    return apiClient.get('/shop/categories');
  },

  buyAccount: async (productId: string): Promise<BuyAccountResponse> => {
    return apiClient.post('/shop/buy', { productId });
  },

  getPurchases: async (): Promise<Purchase[]> => {
    return apiClient.get('/shop/purchases');
  },
};
