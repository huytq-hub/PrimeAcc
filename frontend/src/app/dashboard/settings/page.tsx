"use client";

import { useState } from "react";
import { User, Lock, Bell, Shield, Mail, Phone, Save, Eye, EyeOff, Trash2, AlertTriangle, Palette, Sun, Moon, Check, Crown, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  const { user, isAdmin, isAgent, isMember } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    orderUpdates: true,
    promotions: false,
  });

  const colorThemes = [
    { id: "navy" as const, name: "Navy", primary: "#0F172A", secondary: "#F59E0B", description: "Chuyên nghiệp & Sang trọng" },
    { id: "rose" as const, name: "Rose", primary: "#E11D48", secondary: "#FB7185", description: "Năng động & Hiện đại" },
    { id: "emerald" as const, name: "Emerald", primary: "#059669", secondary: "#10B981", description: "Tươi mới & Tự nhiên" },
    { id: "violet" as const, name: "Violet", primary: "#7C3AED", secondary: "#8B5CF6", description: "Sáng tạo & Độc đáo" },
    { id: "amber" as const, name: "Amber", primary: "#D97706", secondary: "#F59E0B", description: "Ấm áp & Thân thiện" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cài đặt tài khoản</h1>
          {isAdmin && <Crown className="h-7 w-7 text-yellow-500" />}
        </div>
        <p className="mt-2 text-muted-foreground">
          Quản lý thông tin cá nhân và tùy chọn của bạn.
          {isAdmin && " (Quyền quản trị viên)"}
        </p>
      </div>

      {/* Admin-only System Settings */}
      {isAdmin && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="glass rounded-xl p-3">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Cài đặt hệ thống (Admin)</h3>
              <p className="text-sm text-muted-foreground">Quản lý cấu hình toàn hệ thống</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button className="flex items-center space-x-3 glass rounded-xl p-4 border border-border hover:border-yellow-500/30 transition-all cursor-pointer text-left">
              <Settings className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">Quản lý người dùng</p>
                <p className="text-xs text-muted-foreground">Xem và chỉnh sửa tài khoản</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 glass rounded-xl p-4 border border-border hover:border-yellow-500/30 transition-all cursor-pointer text-left">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">Phân quyền</p>
                <p className="text-xs text-muted-foreground">Quản lý vai trò và quyền hạn</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 glass rounded-xl p-4 border border-border hover:border-yellow-500/30 transition-all cursor-pointer text-left">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">Cấu hình hệ thống</p>
                <p className="text-xs text-muted-foreground">API, thanh toán, email</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 glass rounded-xl p-4 border border-border hover:border-yellow-500/30 transition-all cursor-pointer text-left">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">Logs & Monitoring</p>
                <p className="text-xs text-muted-foreground">Xem nhật ký hệ thống</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Customizer */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Palette className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Giao diện & Màu sắc</h3>
                <p className="text-sm text-muted-foreground">Tùy chỉnh giao diện theo sở thích của bạn</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Light/Dark Mode */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Chế độ hiển thị</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center space-x-2 rounded-xl p-4 border-2 transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-primary bg-primary/10"
                        : "border-border glass hover:border-primary/30"
                    }`}
                  >
                    <Sun className={`h-5 w-5 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`font-semibold ${theme === "light" ? "text-primary" : "text-muted-foreground"}`}>
                      Sáng
                    </span>
                    {theme === "light" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center space-x-2 rounded-xl p-4 border-2 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-primary bg-primary/10"
                        : "border-border glass hover:border-primary/30"
                    }`}
                  >
                    <Moon className={`h-5 w-5 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`font-semibold ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`}>
                      Tối
                    </span>
                    {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Bảng màu chủ đạo</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {colorThemes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setColorTheme(ct.id)}
                      className={`flex items-start space-x-3 rounded-xl p-4 border-2 transition-all cursor-pointer text-left ${
                        colorTheme === ct.id
                          ? "border-primary bg-primary/10"
                          : "border-border glass hover:border-primary/30"
                      }`}
                    >
                      <div className="flex space-x-1 flex-shrink-0">
                        <div
                          className="h-10 w-10 rounded-lg"
                          style={{ backgroundColor: ct.primary }}
                        />
                        <div
                          className="h-10 w-5 rounded-lg"
                          style={{ backgroundColor: ct.secondary }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`font-semibold ${colorTheme === ct.id ? "text-primary" : "text-foreground"}`}>
                            {ct.name}
                          </p>
                          {colorTheme === ct.id && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{ct.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-foreground">
                  💡 Thay đổi sẽ được lưu tự động và áp dụng ngay lập tức cho toàn bộ ứng dụng.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Thông tin cá nhân</h3>
                <p className="text-sm text-muted-foreground">Cập nhật thông tin tài khoản</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Họ và tên</label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="h-11 w-full rounded-xl border border-border glass px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                  <input
                    type="text"
                    defaultValue="adminuser"
                    className="h-11 w-full rounded-xl border border-border glass px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@primeacc.com"
                  className="h-11 w-full rounded-xl border border-border glass px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue="+84 123 456 789"
                  className="h-11 w-full rounded-xl border border-border glass px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-cta/30 cursor-pointer">
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Lock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Bảo mật</h3>
                <p className="text-sm text-muted-foreground">Thay đổi mật khẩu và cài đặt bảo mật</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-11 w-full rounded-xl border border-border glass px-4 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    className="h-11 w-full rounded-xl border border-border glass px-4 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-11 w-full rounded-xl border border-border glass px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer">
                <Lock className="h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Thông báo</h3>
                <p className="text-sm text-muted-foreground">Quản lý cách bạn nhận thông báo</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Thông báo Email</p>
                  <p className="text-xs text-muted-foreground">Nhận thông báo qua email</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifications.email ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Thông báo SMS</p>
                  <p className="text-xs text-muted-foreground">Nhận thông báo qua tin nhắn</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifications.sms ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Cập nhật đơn hàng</p>
                  <p className="text-xs text-muted-foreground">Thông báo về trạng thái đơn hàng</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, orderUpdates: !notifications.orderUpdates })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifications.orderUpdates ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.orderUpdates ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Khuyến mãi</p>
                  <p className="text-xs text-muted-foreground">Nhận thông tin ưu đãi và khuyến mãi</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    notifications.promotions ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.promotions ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-foreground">Thông tin tài khoản</h3>
            </div>
            <div className="space-y-3">
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Vai trò</p>
                <p className={`text-sm font-bold ${
                  isAdmin ? "text-yellow-500" : isAgent ? "text-blue-500" : "text-green-500"
                }`}>
                  {isAdmin && "👑 Admin"}
                  {isAgent && "🛡️ Agent"}
                  {isMember && "👤 Member"}
                </p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-semibold text-foreground">{user?.username || "N/A"}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <p className="text-sm font-bold text-green-500">
                  {isAdmin ? "System Admin" : isAgent ? "Premium Agent" : "Active Member"}
                </p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Ngày tham gia</p>
                <p className="text-sm font-semibold text-foreground">15/01/2024</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-sm font-semibold text-foreground">127 đơn</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-sm font-semibold text-foreground">12,450,000đ</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card rounded-2xl p-6 border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-bold text-foreground">Vùng nguy hiểm</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
            </p>
            <button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-red-500/30 cursor-pointer w-full justify-center">
              <Trash2 className="h-4 w-4" />
              <span>Xóa tài khoản</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
