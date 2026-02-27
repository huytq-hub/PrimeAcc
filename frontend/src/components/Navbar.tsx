"use client";

import { useState } from "react";
import { Bell, Search, User, Moon, Sun, Menu } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4 flex-1">
          <button className="lg:hidden rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm dịch vụ..." 
              className="h-10 w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive border border-card" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-3 rounded-xl border border-border glass p-1.5 pr-3 transition-all hover:border-primary/30 cursor-pointer ml-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cta text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-sm lg:block">
              <p className="font-semibold leading-none text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
