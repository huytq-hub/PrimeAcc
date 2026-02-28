"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Copy, CheckCircle2, Clock, Loader2, Package } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { shopApi, Purchase } from "@/lib/api/shop";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await shopApi.getPurchases();
      setPurchases(data || []);
    } catch (error) {
      console.error("Failed to load purchases:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (purchaseId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(purchaseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Đang tải lịch sử mua hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <div className="rounded-xl bg-gradient-to-br from-cta/20 to-primary/20 p-3">
          <Package className="h-7 w-7 text-cta" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tài khoản đã mua</h1>
          <p className="mt-1 text-muted-foreground">Lịch sử mua tài khoản Premium và thông tin đăng nhập.</p>
        </div>
      </div>

      {!purchases || purchases.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">Chưa có tài khoản nào</h3>
          <p className="text-muted-foreground mb-6">Bạn chưa mua tài khoản nào. Hãy khám phá cửa hàng của chúng tôi!</p>
          <a
            href="/dashboard/shop"
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Đi đến cửa hàng</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases?.map((purchase) => (
            <div
              key={purchase.id}
              className="glass-card rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="glass rounded-xl p-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{purchase.product.name}</h3>
                    {purchase.product.description && (
                      <p className="text-sm text-muted-foreground mt-1">{purchase.product.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(purchase.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-semibold text-green-500">Đã giao hàng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 lg:items-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Giá</p>
                    <p className="text-xl font-black text-foreground">{formatNumber(purchase.price)}đ</p>
                  </div>
                </div>
              </div>

              {purchase.stock && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">Thông tin tài khoản:</p>
                  <div className="glass rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between space-x-3">
                      <code className="text-sm font-mono text-foreground bg-muted px-3 py-2 rounded-lg flex-1 break-all">
                        {purchase.stock.content}
                      </code>
                      <button
                        onClick={() => handleCopy(purchase.id, purchase.stock!.content)}
                        className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
                        title="Copy"
                      >
                        {copiedId === purchase.id ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {copiedId === purchase.id && (
                      <p className="text-xs text-green-500 mt-2">Đã copy vào clipboard!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
