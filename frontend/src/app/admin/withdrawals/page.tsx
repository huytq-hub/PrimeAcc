'use client';

import { useEffect, useState } from 'react';
import { adminApi, Withdrawal } from '@/lib/api/admin';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // Show all by default
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'complete' | 'reject'>('approve');

  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      console.log('Loading withdrawals with status:', statusFilter);
      const data = await adminApi.getWithdrawals(statusFilter || undefined);
      console.log('Withdrawals loaded:', data);
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
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

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Chờ duyệt' },
      APPROVED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Đã duyệt' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Hoàn thành' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Từ chối' },
    };
    return config[status as keyof typeof config] || config.PENDING;
  };

  const handleAction = (withdrawal: Withdrawal, action: 'approve' | 'complete' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setActionType(action);
    setShowActionModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
            Yêu cầu rút tiền
          </h1>
          <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
            Quản lý yêu cầu rút hoa hồng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex gap-2 overflow-x-auto">
            {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', ''].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-blue-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{ fontFamily: 'Fira Sans, sans-serif' }}
              >
                {status === '' ? 'Tất cả' : status === 'PENDING' ? 'Chờ duyệt' : status === 'APPROVED' ? 'Đã duyệt' : status === 'COMPLETED' ? 'Hoàn thành' : 'Từ chối'}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            </div>
          ) : !withdrawals || withdrawals.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Không có yêu cầu rút tiền</p>
            </div>
          ) : (
            withdrawals.map((withdrawal) => {
              const statusConfig = getStatusBadge(withdrawal.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={withdrawal.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.color}`}
                        >
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusConfig.label}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(withdrawal.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Người dùng</p>
                          <p className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                            {withdrawal.user.username}
                          </p>
                          <p className="text-sm text-slate-500">{withdrawal.user.email}</p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-600">Số dư hoa hồng</p>
                          <p className="font-semibold text-green-600" style={{ fontFamily: 'Fira Code, monospace' }}>
                            {formatCurrency(withdrawal.user.commissionBalance)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-600">Ngân hàng</p>
                          <p className="font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                            {withdrawal.bankName}
                          </p>
                          <p className="text-sm text-slate-500">{withdrawal.bankAccount}</p>
                          <p className="text-sm text-slate-500">{withdrawal.bankAccountName}</p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-600">Số tiền rút</p>
                          <p className="text-2xl font-bold text-blue-800" style={{ fontFamily: 'Fira Code, monospace' }}>
                            {formatCurrency(withdrawal.amount)}
                          </p>
                        </div>
                      </div>

                      {withdrawal.note && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Ghi chú</p>
                          <p className="text-sm text-slate-900">{withdrawal.note}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {withdrawal.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(withdrawal, 'approve')}
                            className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium text-sm"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleAction(withdrawal, 'reject')}
                            className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium text-sm"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      {withdrawal.status === 'APPROVED' && (
                        <button
                          onClick={() => handleAction(withdrawal, 'complete')}
                          className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium text-sm"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedWithdrawal && (
        <ActionModal
          withdrawal={selectedWithdrawal}
          actionType={actionType}
          onClose={() => {
            setShowActionModal(false);
            setSelectedWithdrawal(null);
          }}
          onSuccess={() => {
            loadWithdrawals();
            setShowActionModal(false);
            setSelectedWithdrawal(null);
          }}
        />
      )}
    </div>
  );
}

function ActionModal({
  withdrawal,
  actionType,
  onClose,
  onSuccess,
}: {
  withdrawal: Withdrawal;
  actionType: 'approve' | 'complete' | 'reject';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (actionType === 'approve') {
        await adminApi.approveWithdrawal(withdrawal.id);
      } else if (actionType === 'complete') {
        await adminApi.completeWithdrawal(withdrawal.id);
      } else {
        await adminApi.rejectWithdrawal(withdrawal.id, note || undefined);
      }
      alert('Đã xử lý thành công!');
      onSuccess();
    } catch (error) {
      console.error('Failed to process withdrawal:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const config = {
    approve: { title: 'Duyệt yêu cầu', color: 'blue', action: 'Duyệt' },
    complete: { title: 'Hoàn thành', color: 'green', action: 'Hoàn thành' },
    reject: { title: 'Từ chối yêu cầu', color: 'red', action: 'Từ chối' },
  };

  const current = config[actionType];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Fira Code, monospace' }}>
          {current.title}
        </h2>

        <div className="mb-4 p-4 bg-slate-50 rounded-lg space-y-2">
          <div>
            <p className="text-sm text-slate-600">Người dùng</p>
            <p className="font-semibold text-slate-900">{withdrawal.user.username}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Số tiền</p>
            <p className="text-xl font-bold text-blue-800" style={{ fontFamily: 'Fira Code, monospace' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(withdrawal.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Ngân hàng</p>
            <p className="font-semibold text-slate-900">{withdrawal.bankName}</p>
            <p className="text-sm text-slate-500">{withdrawal.bankAccount}</p>
            <p className="text-sm text-slate-500">{withdrawal.bankAccountName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {actionType === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lý do từ chối</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập lý do..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ fontFamily: 'Fira Sans, sans-serif' }}
                required
              />
            </div>
          )}

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
              className={`flex-1 px-4 py-2 bg-${current.color}-600 text-white rounded-lg hover:bg-${current.color}-700 transition-colors cursor-pointer font-medium disabled:opacity-50`}
              style={{ backgroundColor: current.color === 'blue' ? '#1E40AF' : current.color === 'green' ? '#059669' : '#DC2626' }}
            >
              {loading ? 'Đang xử lý...' : current.action}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
