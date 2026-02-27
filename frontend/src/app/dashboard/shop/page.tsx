"use client";

import { ShoppingBag, Zap, ShieldCheck, Clock, Star } from "lucide-react";

const products = [
  { id: 1, name: "Netflix Premium - 1 Month", price: 45000, stock: 12, category: "Streaming", rating: 4.8 },
  { id: 2, name: "Spotify Premium Family - 1 Year", price: 180000, stock: 5, category: "Music", rating: 4.9 },
  { id: 3, name: "Canva Pro (Team Invite)", price: 25000, stock: 48, category: "Design", rating: 4.7 },
  { id: 4, name: "ChatGPT Plus (Shared)", price: 95000, stock: 2, category: "AI", rating: 4.6 },
  { id: 5, name: "Youtube Premium - No Ads", price: 35000, stock: 24, category: "Streaming", rating: 4.8 },
  { id: 6, name: "Adobe Creative Cloud", price: 120000, stock: 8, category: "Design", rating: 4.9 },
];

export default function ShopPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-end lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cửa hàng Tài khoản 🛍️</h1>
          <p className="mt-2 text-muted-foreground">Tài khoản Premium, Key bản quyền, giao hàng tự động 24/7.</p>
        </div>
        <div className="flex items-center space-x-3 glass rounded-xl p-4 border border-cta/20">
          <Clock className="h-5 w-5 text-cta" />
          <p className="text-sm font-medium text-foreground">Giao hàng ngay lập tức sau khi thanh toán!</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group relative flex flex-col overflow-hidden glass-card rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer">
            <div className="mb-6 flex items-start justify-between">
              <div className="glass rounded-2xl p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{product.category}</p>
                <div className="mt-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-foreground">{product.rating}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
            
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-xs text-muted-foreground">
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Bảo hành trọn thời gian sử dụng
              </li>
              <li className="flex items-center text-xs text-muted-foreground">
                <Zap className="mr-2 h-4 w-4 text-orange-500" />
                Giao hàng tự động trong 1 phút
              </li>
              <li className="flex items-center text-xs text-muted-foreground">
                <ShoppingBag className="mr-2 h-4 w-4 text-blue-500" />
                Còn lại: <span className="ml-1 font-semibold text-green-500">{product.stock} sản phẩm</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Giá chỉ từ</p>
                <p className="text-2xl font-black text-foreground">{product.price.toLocaleString()}đ</p>
              </div>
              <button className="rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95">
                Mua ngay
              </button>
            </div>
            
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
