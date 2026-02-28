'use client';

import { useEffect, useState } from 'react';
import { adminApi, Transaction } from '@/lib/api/admin';
import { ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [page, typeFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTransactions({
        page,
        limit: 50,
        type: typeFilter || undefined,
      });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getTypeConfig = (type: string) => {
    const config = {
      DEPOSIT: { label: 'Nạp tiền', color: 'text-green-600', icon: ArrowDownRight },
      ACCOUNT_PURCHASE: { label: 'Mua tài khoản', color: 'text-blue-600', icon: ArrowUpRight },
      SMM_ORDER: { label: 'Đơn SMM', color: 'text-purple-600', icon: ArrowUpRight },
      REFUND: { label: 'Hoàn tiền', color: 'text-amber-600', icon: ArrowDownRight },
    };
    return config[type as keyof typeof config] || { label: type, color: 'text-slate-600', icon: ArrowUpRight };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
            Lịch sử giao dịch
          </h1>
          <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
            Theo dõi tất cả giao dịch trong hệ thống
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
              style={{ fontFamily: 'Fira Sans, sans-serif' }}
            >
              <option value="">Tất cả loại giao dịch</option>
              <option value="DEPOSIT">Nạp tiền</option>
              <option value="ACCOUNT_PURCHASE">Mua tài khoản</option>
              <option value="SMM_ORDER">Đơn SMM</option>
              <option value="REFUND">Hoàn tiền</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Số dư cũ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Số dư mới
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Không có giao dịch
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const typeConfig = getTypeConfig(tx.type);
                    const Icon = typeConfig.icon;

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                          {new Date(tx.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                              {tx.user.username}
                            </div>
                            <div className="text-xs text-slate-500">{tx.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center ${typeConfig.color} font-medium`}>
                            <Icon className="w-4 h-4 mr-1" />
                            <span className="text-sm">{typeConfig.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                          {formatCurrency(tx.oldBalance)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                          {formatCurrency(tx.newBalance)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {tx.description || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Trước
              </button>
              <span className="text-sm text-slate-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
