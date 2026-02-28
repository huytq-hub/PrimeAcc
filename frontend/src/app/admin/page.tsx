'use client';

import { useEffect, useState } from 'react';
import { adminApi, DashboardStats } from '@/lib/api/admin';
import {
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      trend: null,
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: null,
    },
    {
      title: 'Tổng nạp tiền',
      value: formatCurrency(stats?.totalDeposits || 0),
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: null,
    },
    {
      title: 'Tổng đơn hàng',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-amber-500',
      trend: null,
    },
    {
      title: 'Doanh thu hôm nay',
      value: formatCurrency(stats?.todayRevenue || 0),
      icon: ArrowUpRight,
      color: 'bg-emerald-500',
      trend: 'up',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: stats?.todayOrders || 0,
      icon: ShoppingBag,
      color: 'bg-cyan-500',
      trend: 'up',
    },
    {
      title: 'Yêu cầu rút tiền',
      value: stats?.pendingWithdrawals || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      trend: stats?.pendingWithdrawals ? 'alert' : null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
            Tổng quan hệ thống PrimeAcc
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                      {card.title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {card.trend === 'alert' && (
                  <div className="mt-4 flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>Cần xử lý</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Quản lý người dùng"
            description="Xem và quản lý tài khoản người dùng"
            href="/admin/users"
            icon={Users}
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Quản lý sản phẩm"
            description="Thêm, sửa, xóa sản phẩm và stock"
            href="/admin/products"
            icon={ShoppingBag}
            color="bg-amber-500"
          />
          <QuickActionCard
            title="Yêu cầu rút tiền"
            description="Xử lý yêu cầu rút hoa hồng"
            href="/admin/withdrawals"
            icon={AlertCircle}
            color="bg-red-500"
            badge={stats?.pendingWithdrawals}
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  color,
  badge,
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  badge?: number;
}) {
  return (
    <a
      href={href}
      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
        {description}
      </p>
    </a>
  );
}
