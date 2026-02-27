"use client";

import { useState } from "react";
import { Search, Download, Eye, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const orders = [
  { 
    id: "ORD-2024-001", 
    service: "TikTok Follow - Server 1", 
    platform: "TikTok",
    quantity: 5000, 
    delivered: 5000,
    amount: 250000, 
    status: "completed", 
    date: "2024-02-27 14:30",
    link: "https://tiktok.com/@username"
  },
  { 
    id: "ORD-2024-002", 
    service: "Instagram Likes - Premium", 
    platform: "Instagram",
    quantity: 10000, 
    delivered: 7500,
    amount: 80000, 
    status: "processing", 
    date: "2024-02-27 12:15",
    link: "https://instagram.com/p/abc123"
  },
  { 
    id: "ORD-2024-003", 
    service: "YouTube Views - Real", 
    platform: "YouTube",
    quantity: 50000, 
    delivered: 50000,
    amount: 450000, 
    status: "completed", 
    date: "2024-02-26 18:45",
    link: "https://youtube.com/watch?v=abc123"
  },
  { 
    id: "ORD-2024-004", 
    service: "Facebook Page Likes", 
    platform: "Facebook",
    quantity: 2000, 
    delivered: 0,
    amount: 360000, 
    status: "pending", 
    date: "2024-02-26 10:20",
    link: "https://facebook.com/page"
  },
  { 
    id: "ORD-2024-005", 
    service: "TikTok Views - Instant", 
    platform: "TikTok",
    quantity: 100000, 
    delivered: 45000,
    amount: 500000, 
    status: "processing", 
    date: "2024-02-25 16:00",
    link: "https://tiktok.com/@user/video/123"
  },
  { 
    id: "ORD-2024-006", 
    service: "Instagram Followers", 
    platform: "Instagram",
    quantity: 1000, 
    delivered: 0,
    amount: 120000, 
    status: "cancelled", 
    date: "2024-02-25 09:30",
    link: "https://instagram.com/username"
  },
];

const statusConfig = {
  completed: { label: "Hoàn thành", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2 },
  processing: { label: "Đang xử lý", color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
  pending: { label: "Chờ xử lý", color: "text-orange-500", bg: "bg-orange-500/10", icon: AlertCircle },
  cancelled: { label: "Đã hủy", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    processing: orders.filter(o => o.status === "processing").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quản lý đơn hàng</h1>
        <p className="mt-2 text-muted-foreground">Theo dõi và quản lý tất cả đơn hàng của bạn.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-2xl p-6 cursor-pointer hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 cursor-pointer hover:border-green-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hoàn thành</p>
              <p className="mt-2 text-3xl font-bold text-green-500">{stats.completed}</p>
            </div>
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 cursor-pointer hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đang xử lý</p>
              <p className="mt-2 text-3xl font-bold text-blue-500">{stats.processing}</p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 cursor-pointer hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã hủy</p>
              <p className="mt-2 text-3xl font-bold text-red-500">{stats.cancelled}</p>
            </div>
            <div className="rounded-xl bg-red-500/10 p-3">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm đơn hàng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-border glass pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 glass rounded-xl p-1 border border-border">
              <button
                onClick={() => setFilterStatus("all")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                  filterStatus === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                  filterStatus === "completed" ? "bg-green-500 text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hoàn thành
              </button>
              <button
                onClick={() => setFilterStatus("processing")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                  filterStatus === "processing" ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Đang xử lý
              </button>
            </div>

            <button className="flex items-center space-x-2 rounded-xl glass border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/30 cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mã đơn</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dịch vụ</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số lượng</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tiến độ</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giá trị</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày tạo</th>
                <th className="pb-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                const progress = (order.delivered / order.quantity) * 100;
                
                return (
                  <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                    <td className="py-4">
                      <code className="text-sm font-mono font-semibold text-foreground">{order.id}</code>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.service}</p>
                        <p className="text-xs text-muted-foreground">{order.platform}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-semibold text-foreground">{formatNumber(order.quantity)}</p>
                    </td>
                    <td className="py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{formatNumber(order.delivered)}</span>
                          <span className="text-xs font-semibold text-foreground">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cta to-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-bold text-foreground">{formatNumber(order.amount)}đ</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusConfig[order.status as keyof typeof statusConfig].label}</span>
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </td>
                    <td className="py-4 text-right">
                      <button className="inline-flex items-center space-x-1 rounded-lg glass border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/30 cursor-pointer">
                        <Eye className="h-3 w-3" />
                        <span>Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
