'use client';

import { useEffect, useState } from 'react';
import { adminApi, User } from '@/lib/api/admin';
import { Search, Edit, DollarSign, Shield, TrendingUp } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      AGENT: 'bg-purple-100 text-purple-800',
      MEMBER: 'bg-blue-100 text-blue-800',
    };
    return colors[role as keyof typeof colors] || colors.MEMBER;
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      DIAMOND: 'bg-cyan-100 text-cyan-800',
      GOLD: 'bg-yellow-100 text-yellow-800',
      SILVER: 'bg-slate-100 text-slate-800',
      BRONZE: 'bg-orange-100 text-orange-800',
    };
    return colors[tier as keyof typeof colors] || colors.BRONZE;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
            Quản lý người dùng
          </h1>
          <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
            Tổng số: {users.length} người dùng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo username hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                style={{ fontFamily: 'Fira Sans, sans-serif' }}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
              style={{ fontFamily: 'Fira Sans, sans-serif' }}
            >
              <option value="">Tất cả vai trò</option>
              <option value="MEMBER">Member</option>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer font-medium"
              style={{ fontFamily: 'Fira Sans, sans-serif' }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Số dư
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Hoa hồng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Giới thiệu
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Thao tác
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Không tìm thấy người dùng
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                            {user.username}
                          </div>
                          <div className="text-sm text-slate-500" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                        {formatCurrency(user.balance)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                        {formatCurrency(user.commissionBalance)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadge(user.commissionTier)}`}
                        >
                          {user.commissionTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                        {user._count.referrals}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBalanceModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer text-sm font-medium"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))
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

      {/* Balance Modal */}
      {showBalanceModal && selectedUser && (
        <BalanceModal
          user={selectedUser}
          onClose={() => {
            setShowBalanceModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            loadUsers();
            setShowBalanceModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

function BalanceModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      setLoading(true);
      await adminApi.updateUserBalance(user.id, {
        amount: parseFloat(amount),
        type,
        note: note || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to update balance:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Fira Code, monospace' }}>
          Điều chỉnh số dư
        </h2>
        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">Người dùng</p>
          <p className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
            {user.username}
          </p>
          <p className="text-sm text-slate-600 mt-2">Số dư hiện tại</p>
          <p className="font-semibold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.balance)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Loại</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('ADD')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  type === 'ADD'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cộng tiền
              </button>
              <button
                type="button"
                onClick={() => setType('SUBTRACT')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  type === 'SUBTRACT'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Trừ tiền
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ fontFamily: 'Fira Code, monospace' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lý do điều chỉnh..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ fontFamily: 'Fira Sans, sans-serif' }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer font-medium disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
