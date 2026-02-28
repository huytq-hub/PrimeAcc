'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  Wallet,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Sản phẩm', href: '/admin/products', icon: ShoppingBag },
    { name: 'Giao dịch', href: '/admin/transactions', icon: Receipt },
    { name: 'Rút tiền', href: '/admin/withdrawals', icon: Wallet },
  ];

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Block access if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-blue-800" style={{ fontFamily: 'Fira Code, monospace' }}>
              PrimeAcc Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-blue-800 transition-colors cursor-pointer group"
                  style={{ fontFamily: 'Fira Sans, sans-serif' }}
                >
                  <Icon className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-800" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & Logout */}
          <div className="px-4 py-4 border-t border-slate-200">
            <div className="px-4 py-3 bg-slate-50 rounded-lg mb-2">
              <p className="text-xs text-slate-500" style={{ fontFamily: 'Fira Sans, sans-serif' }}>
                Đăng nhập với
              </p>
              <p className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Fira Code, monospace' }}>
                {user.username}
              </p>
              <p className="text-xs text-amber-600 font-medium mt-1">ADMIN</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              style={{ fontFamily: 'Fira Sans, sans-serif' }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
