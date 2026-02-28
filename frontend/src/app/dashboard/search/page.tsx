"use client";

import { useState } from "react";
import { Search, TrendingUp, Clock, Star } from "lucide-react";

const trendingSearches = [
  "TikTok Follow",
  "Facebook Like",
  "Instagram View",
  "YouTube Subscribe",
  "Spotify Premium",
  "Netflix Account",
];

const recentSearches = [
  "Tăng follow TikTok",
  "Mua tài khoản Netflix",
  "Dịch vụ SMM",
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tìm kiếm</h1>
          <Search className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
        </div>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Tìm kiếm dịch vụ và sản phẩm bạn cần
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ, sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass rounded-xl pl-12 pr-4 py-4 text-base text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Trending Searches */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">Tìm kiếm phổ biến</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((search) => (
            <button
              key={search}
              onClick={() => setSearchQuery(search)}
              className="glass rounded-lg px-4 py-2 text-sm font-medium text-foreground border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer active:scale-95"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="text-base sm:text-lg font-bold text-foreground">Tìm kiếm gần đây</h3>
            </div>
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              Xóa tất cả
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(search)}
                className="w-full flex items-center justify-between glass rounded-lg px-4 py-3 text-sm text-foreground border border-border hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>{search}</span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Categories */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">Danh mục nổi bật</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["SMM Services", "Premium Accounts", "Software Keys", "Hosting", "Email", "VPN"].map((category) => (
            <button
              key={category}
              className="glass rounded-xl p-4 text-center border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer active:scale-95"
            >
              <p className="text-sm font-semibold text-foreground">{category}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
