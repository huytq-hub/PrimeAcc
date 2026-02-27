"use client";

import { useState } from "react";
import { Search, Facebook, Instagram, Youtube, Twitter, TrendingUp, ExternalLink } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const categories = [
  { name: "Tất cả", icon: TrendingUp, count: 156 },
  { name: "Facebook", icon: Facebook, count: 42 },
  { name: "TikTok", icon: ExternalLink, count: 38 },
  { name: "Instagram", icon: Instagram, count: 35 },
  { name: "YouTube", icon: Youtube, count: 41 },
];

const services = [
  { id: 1, name: "Follow TikTok - Server 1 (Bảo hành 30 ngày)", price: 50, platform: "TikTok", min: 100, max: 50000, speed: "Fast", quality: "High" },
  { id: 2, name: "Like Facebook Post - SPEED HIGH", price: 12, platform: "Facebook", min: 100, max: 20000, speed: "Fast", quality: "Medium" },
  { id: 3, name: "Youtube Subscribers - REAL USER", price: 450, platform: "YouTube", min: 100, max: 5000, speed: "Medium", quality: "Premium" },
  { id: 4, name: "Instagram Likes - NO DROP", price: 8, platform: "Instagram", min: 50, max: 100000, speed: "Fast", quality: "High" },
  { id: 5, name: "TikTok Views - INSTANT", price: 5, platform: "TikTok", min: 1000, max: 1000000, speed: "Instant", quality: "High" },
  { id: 6, name: "Facebook Page Likes - REAL", price: 180, platform: "Facebook", min: 100, max: 10000, speed: "Medium", quality: "Premium" },
];

export default function SmmPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === "Tất cả" || service.platform === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dịch vụ SMM</h1>
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
        <p className="mt-2 text-muted-foreground">Tăng tương tác mạng xã hội với tốc độ và giá tốt nhất.</p>
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.name 
                  ? "bg-gradient-to-r from-cta to-primary text-white shadow-lg shadow-cta/30" 
                  : "glass text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.name}</span>
              <span className={`text-xs ${activeCategory === cat.name ? 'text-white/80' : 'text-muted-foreground'}`}>
                ({cat.count})
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input 
            type="text" 
            placeholder="Tìm dịch vụ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-border glass pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="group flex flex-col justify-between glass-card rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-lg bg-gradient-to-r from-cta/20 to-primary/20 px-2.5 py-1 text-[10px] font-bold text-cta uppercase tracking-wide">
                  {service.platform}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`h-2 w-2 rounded-full ${
                    service.speed === 'Instant' ? 'bg-green-500' : 
                    service.speed === 'Fast' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-[10px] text-muted-foreground">{service.speed}</span>
                </div>
              </div>
              
              <h4 className="font-bold leading-tight text-foreground transition-all group-hover:text-primary min-h-[2.5rem]">
                {service.name}
              </h4>
              
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Min: {formatNumber(service.min)}</span>
                <span>Max: {formatNumber(service.max)}</span>
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  service.quality === 'Premium' ? 'bg-purple-500/10 text-purple-500' :
                  service.quality === 'High' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {service.quality}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-2xl font-black text-foreground">
                  {service.price}đ 
                  <span className="text-xs font-normal text-muted-foreground ml-1">/ 1.000</span>
                </p>
              </div>
            </div>
            
            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-cta to-primary py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95">
              Đặt hàng ngay
            </button>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy dịch vụ phù hợp</p>
        </div>
      )}
    </div>
  );
}
