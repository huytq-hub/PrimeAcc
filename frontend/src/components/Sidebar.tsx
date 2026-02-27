"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, 
  Globe, 
  CreditCard, 
  FileText, 
  Users,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, name: "Trang chủ", href: "/dashboard" },
  { icon: Globe, name: "Dịch vụ SMM", href: "/dashboard/smm" },
  { icon: ShoppingCart, name: "Mua tài khoản", href: "/dashboard/shop" },
  { icon: CreditCard, name: "Nạp tiền", href: "/dashboard/deposit" },
  { icon: FileText, name: "Tài liệu API", href: "/dashboard/api" },
  { icon: Users, name: "Cộng tác viên", href: "/dashboard/partnership" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-border glass-card lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">PRIME</span>
            <span className="text-foreground">ACC</span>
          </span>
        </Link>
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
        <div className="glass rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cta/10 blur-2xl" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số dư của bạn</p>
          <p className="mt-2 text-2xl font-bold text-foreground">1,250,000đ</p>
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
