"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Product, BuyAccountResponse } from "@/lib/api/shop";
import { formatNumber } from "@/lib/utils";

interface BuyModalProps {
  product: Product;
  userBalance: number;
  onClose: () => void;
  onBuy: (productId: string) => Promise<BuyAccountResponse>;
  onSuccess: () => Promise<void>;
}

export default function BuyModal({ product, userBalance, onClose, onBuy, onSuccess }: BuyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [accountData, setAccountData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  console.log('BuyModal - userBalance:', userBalance, 'product.price:', product.price);
  const canAfford = !isNaN(userBalance) && userBalance >= product.price;
  console.log('BuyModal - canAfford:', canAfford);

  const handleBuy = async () => {
    if (!canAfford) {
      setError("Số dư không đủ. Vui lòng nạp thêm tiền.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onBuy(product.id);
      
      // Auto-copy account data to clipboard
      if (result.accountData) {
        navigator.clipboard.writeText(result.accountData);
      }
      
      // Call onSuccess to reload balance from server
      await onSuccess();
      
      // Close modal immediately after successful purchase
      onClose();
      
      // Show success notification (you can add a toast notification here)
      console.log('Purchase successful! Account data copied to clipboard:', result.accountData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (accountData) {
      navigator.clipboard.writeText(accountData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (success && accountData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full space-y-4 sm:space-y-6 animate-in fade-in zoom-in duration-200 my-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-green-500/20 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Mua thành công!</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Giao dịch thành công</p>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Số tiền thanh toán</p>
                  <p className="font-bold text-foreground">{formatNumber(product.price)}đ</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Số dư còn lại</p>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatNumber(newBalance ?? 0)}đ
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Thông tin tài khoản:</p>
                {copied && (
                  <span className="text-xs text-green-500 font-semibold">✓ Đã copy!</span>
                )}
              </div>
              <div className="flex items-center justify-between space-x-3">
                <code className="text-sm font-mono text-foreground bg-muted px-3 py-2 rounded-lg flex-1 break-all">
                  {accountData}
                </code>
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                  title="Copy"
                  aria-label="Copy account data"
                >
                  <Copy className={`h-5 w-5 ${copied ? "text-green-500" : "text-muted-foreground"}`} />
                </button>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
              <p className="text-xs text-muted-foreground">
                💡 Thông tin đã được tự động copy. Bạn có thể xem lại trong mục <a href="/dashboard/purchases" className="font-semibold text-cta hover:underline">"Tài khoản đã mua"</a>.
              </p>
            </div>

            <div className="glass rounded-xl p-3 border border-muted bg-muted/30">
              <p className="text-xs text-center text-muted-foreground">
                Cửa sổ này sẽ tự động đóng sau 5 giây...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 cursor-pointer min-h-[48px]"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full space-y-4 sm:space-y-6 animate-in fade-in zoom-in duration-200 my-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-br from-cta/20 to-primary/20 p-3">
              <ShoppingBag className="h-6 w-6 text-cta" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Xác nhận mua hàng</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
            disabled={loading}
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Sản phẩm:</p>
            <p className="text-lg font-bold text-foreground">{product.name}</p>
            {product.description && (
              <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Giá sản phẩm</p>
              <p className="text-2xl font-black text-foreground">{formatNumber(product.price)}đ</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Số dư của bạn</p>
              <p className={`text-2xl font-black ${canAfford ? "text-green-500" : "text-red-500"}`}>
                {isNaN(userBalance) ? "0đ" : `${formatNumber(userBalance)}đ`}
              </p>
            </div>
          </div>

          {canAfford && (
            <div className="glass rounded-xl p-4 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">Đủ số dư</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sau khi mua còn lại: <span className="font-semibold text-foreground">{formatNumber((userBalance || 0) - product.price)}đ</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {!canAfford && (
            <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/5">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Số dư không đủ</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Bạn cần thêm <span className="font-bold text-red-500">{formatNumber(Math.max(0, product.price - (userBalance || 0)))}đ</span> để mua sản phẩm này.
                  </p>
                  <a 
                    href="/dashboard/deposit" 
                    className="inline-flex items-center text-xs font-semibold text-cta hover:underline"
                  >
                    Nạp tiền ngay →
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="glass rounded-xl p-4 border border-red-500/20 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-border px-4 sm:px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            Hủy
          </button>
          <button
            onClick={handleBuy}
            disabled={loading || !canAfford}
            className="flex-1 rounded-xl bg-gradient-to-r from-cta to-primary px-4 sm:px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? "Đang xử lý..." : "Xác nhận mua"}
          </button>
        </div>
      </div>
    </div>
  );
}
