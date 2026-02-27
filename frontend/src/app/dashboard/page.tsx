"use client";

import { TrendingUp, ShoppingBag, CreditCard, Activity, ArrowUpRight, Clock, Sparkles, Flame, Shield, Users, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Tổng đơn hàng", value: "1,280", change: "+12.5%", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Số dư ví", value: "1,250,000đ", change: "+8.2%", icon: CreditCard, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Tiêu thụ (Tháng)", value: "540,000đ", change: "+23.1%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Cấp bậc", value: "Đại lý", change: "Level 3", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
];

const recentOrders = [
  { id: "ORD-1231", service: "Tăng Follow TikTok", amount: "5,000đ", status: "completed", date: "25/02/2024" },
  { id: "ORD-1232", service: "Like Facebook Post", amount: "3,500đ", status: "processing", date: "25/02/2024" },
  { id: "ORD-1233", service: "Youtube Views", amount: "12,000đ", status: "completed", date: "24/02/2024" },
];

export default function DashboardPage() {
  const { user, isAdmin, isAgent, isMember } = useAuth();
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Chào mừng trở lại{user?.username ? `, ${user.username}` : ""}!
          </h1>
          <Sparkles className="h-7 w-7 text-yellow-500" />
          {isAdmin && <Crown className="h-7 w-7 text-yellow-500" />}
          {isAgent && <Shield className="h-7 w-7 text-blue-500" />}
        </div>
        <p className="mt-2 text-muted-foreground">
          Theo dõi hoạt động và quản lý các đơn hàng của bạn.
          {isAdmin && " (Chế độ quản trị viên)"}
          {isAgent && " (Chế độ đại lý)"}
        </p>
      </div>

      {/* Admin-only System Stats */}
      {isAdmin && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-bold text-foreground">Thống kê hệ thống (Admin)</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Tổng người dùng</p>
              <p className="text-2xl font-bold text-foreground">1,542</p>
              <p className="text-xs text-green-500 mt-1">+45 hôm nay</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-foreground">24.5M đ</p>
              <p className="text-xs text-green-500 mt-1">+18.2%</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Đơn hàng đang xử lý</p>
              <p className="text-2xl font-bold text-foreground">87</p>
              <p className="text-xs text-orange-500 mt-1">Cần xem xét</p>
            </div>
          </div>
        </div>
      )}

      {/* Agent-only Commission Stats */}
      {isAgent && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-bold text-foreground">Hoa hồng đại lý</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Hoa hồng tháng này</p>
              <p className="text-2xl font-bold text-blue-500">1.2M đ</p>
              <p className="text-xs text-green-500 mt-1">+23.5%</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Khách hàng giới thiệu</p>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-blue-500 mt-1">+3 tuần này</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Cấp bậc</p>
              <p className="text-2xl font-bold text-foreground">Silver</p>
              <p className="text-xs text-muted-foreground mt-1">1.5M đến Gold</p>
            </div>
          </div>
        </div>
      )}

      {/* Member-only Upgrade Prompt */}
      {isMember && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="glass rounded-xl p-3">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Nâng cấp lên Đại lý</h3>
                <p className="text-sm text-muted-foreground">Kiếm thêm thu nhập với hoa hồng lên đến 20%</p>
              </div>
            </div>
            <button className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden glass-card rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="mt-2 flex items-center space-x-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`rounded-xl ${stat.bg} p-3 transition-transform group-hover:scale-110`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className={`absolute -right-8 -bottom-8 h-24 w-24 rounded-full ${stat.bg} blur-2xl opacity-50`} />
          </div>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Đơn hàng mới nhất</h3>
            <button className="text-sm font-semibold text-cta hover:text-cta/80 cursor-pointer">
              Xem tất cả →
            </button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-border glass p-4 transition-all hover:border-primary/30 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cta/20 to-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-cta" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{order.service}</p>
                    <p className="text-xs text-muted-foreground">ID: {order.id} • {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{order.amount}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    order.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <h3 className="text-lg font-bold text-foreground">Gợi ý dịch vụ</h3>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="space-y-4">
            <div className="glass rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 cursor-pointer hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold text-blue-600 dark:text-blue-400">TikTok Follow (Global)</p>
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">HOT</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Dịch vụ đang Hot nhất trong tuần qua.</p>
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30">
                Sử dụng ngay
              </button>
            </div>
            
            <div className="glass rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-4 cursor-pointer hover:border-red-500/40 transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold text-red-600 dark:text-red-400">Youtube Views</p>
                <Clock className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mb-3">Tốc độ ổn định, không tụt.</p>
              <button className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-2 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/30">
                Sử dụng ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
