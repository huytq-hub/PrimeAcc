"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Globe, 
  CreditCard, 
  FileText, 
  Users,
  LayoutDashboard,
  Sparkles,
  Package,
  Settings,
  Moon,
  Sun,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, name: "Trang chủ", href: "/dashboard" },
  { icon: Globe, name: "Dịch vụ SMM", href: "/dashboard/smm" },
  { icon: ShoppingCart, name: "Mua tài khoản", href: "/dashboard/shop" },
  { icon: Package, name: "Đơn hàng SMM", href: "/dashboard/orders" },
  { icon: Sparkles, name: "Tài khoản đã mua", href: "/dashboard/purchases" },
  { icon: CreditCard, name: "Nạp tiền", href: "/dashboard/deposit" },
  { icon: FileText, name: "Tài liệu API", href: "/dashboard/api" },
  { icon: Users, name: "Cộng tác viên", href: "/dashboard/partnership" },
  { icon: Settings, name: "Cài đặt", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "AGENT":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "MEMBER":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-border glass-card lg:flex">
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">PRIME</span>
            <span className="text-foreground">ACC</span>
          </span>
        </Link>
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg glass border border-border hover:border-primary/30 transition-all cursor-pointer"
          title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        {/* User Section */}
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.username || "User"}
              </p>
              <span className={cn(
                "inline-block text-xs font-medium px-2 py-0.5 rounded-md border mt-1",
                getRoleBadgeColor(user?.role || "MEMBER")
              )}>
                {user?.role || "MEMBER"}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 py-2.5 text-sm font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Balance Section */}
        <div className="glass rounded-2xl p-4 relative overflow-hidden mt-3">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cta/10 blur-2xl" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số dư của bạn</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {user?.balance?.toLocaleString('vi-VN') || '0'}đ
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-cta to-primary rounded-full" />
          </div>
          <button className="mt-3 w-full rounded-xl bg-cta text-cta-foreground py-2 text-sm font-semibold hover:bg-cta/90 cursor-pointer">
            Nạp tiền ngay
          </button>
        </div>
      </div>
    </aside>
  );
}
