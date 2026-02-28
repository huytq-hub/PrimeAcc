"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  href: string;
  badge?: number;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Trang chủ",
      icon: Home,
      href: "/dashboard",
    },
    {
      id: "shop",
      label: "Cửa hàng",
      icon: ShoppingBag,
      href: "/dashboard/shop",
    },
    {
      id: "search",
      label: "Tìm kiếm",
      icon: Search,
      href: "/dashboard/search",
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      href: "/dashboard/purchases",
      badge: 0,
    },
    {
      id: "profile",
      label: "Tài khoản",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  const handleNavClick = (href: string) => {
    // Add haptic feedback for mobile devices
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      
      {/* Bottom Navigation Bar - Only visible on mobile */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Glass effect background with blur */}
        <div className="absolute inset-0 glass-card border-t border-border backdrop-blur-xl" />
        
        {/* Navigation items */}
        <div className="relative flex items-center justify-around px-2 py-2 safe-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[64px] min-h-[64px] 
                  rounded-2xl px-3 py-2
                  transition-all duration-300 ease-out
                  active:scale-90
                  touch-manipulation
                  ${active 
                    ? "text-primary" 
                    : "text-muted-foreground"
                  }
                `}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                {/* Icon Container with animated background */}
                <div className={`
                  relative flex items-center justify-center
                  w-12 h-12 rounded-2xl
                  transition-all duration-300 ease-out
                  ${active 
                    ? "bg-gradient-to-br from-primary/20 to-cta/20 scale-110 shadow-lg shadow-primary/20" 
                    : "bg-transparent scale-100 hover:bg-muted/50"
                  }
                `}>
                  {/* Glow effect for active item */}
                  {active && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-cta/30 blur-md animate-pulse" />
                  )}
                  
                  <Icon 
                    className={`
                      relative z-10 transition-all duration-300
                      ${active ? "h-7 w-7 stroke-[2.5]" : "h-6 w-6 stroke-[2]"}
                    `}
                  />
                  
                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-background shadow-lg animate-in zoom-in duration-200">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label with fade animation */}
                <span className={`
                  mt-1 text-[11px] font-semibold leading-tight text-center
                  transition-all duration-300
                  ${active 
                    ? "opacity-100 scale-100" 
                    : "opacity-60 scale-95"
                  }
                `}>
                  {item.label}
                </span>

                {/* Active Indicator - Bottom dot */}
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-in zoom-in duration-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* Safe area for iOS devices with notch */}
        <div 
          className="bg-background/80 backdrop-blur-xl" 
          style={{ height: "env(safe-area-inset-bottom)" }}
        />
      </nav>
    </>
  );
}

