"use client";

import { User, Mail, Phone, Calendar, Shield, Crown, Settings, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isAdmin, isAgent, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      icon: User,
      label: "Thông tin cá nhân",
      href: "/dashboard/profile/edit",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      href: "/dashboard/settings",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Shield,
      label: "Bảo mật",
      href: "/dashboard/security",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tài khoản</h1>
          <User className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
        </div>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Quản lý thông tin và cài đặt tài khoản
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-cta/10 border-2 border-primary/30">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cta to-primary flex items-center justify-center text-white">
              <User className="h-10 w-10" />
            </div>
            {isAdmin && (
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-background">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            {isAgent && !isAdmin && (
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-background">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              {user?.username || "User"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "Quản trị viên" : isAgent ? "Đại lý" : "Thành viên"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Ngày tham gia</p>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Quản lý tài khoản</h3>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between glass rounded-xl p-4 border border-border hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3">
                  <div className={`rounded-xl ${item.bg} p-2`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Số dư</p>
          <p className="text-xl sm:text-2xl font-bold text-green-500">
            {user?.balance?.toLocaleString("vi-VN") || "0"}đ
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng đơn</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 glass-card rounded-2xl p-4 border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-semibold transition-all cursor-pointer active:scale-[0.98]"
      >
        <LogOut className="h-5 w-5" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
