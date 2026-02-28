"use client";

import { useState } from "react";
import { X, ShoppingBag, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Product, BuyAccountResponse } from "@/lib/api/shop";
import { formatNumber } from "@/lib/utils";

interface BuyModalProps {
  product: Product;
  userBalance: number;
  onClose: () => void;
  onBuy: (productId: string) => Promise<BuyAccountResponse>;
  onSuccess: () => void;
}

export default function BuyModal({ product, userBalance, onClose, onBuy, onSuccess }: BuyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [accountData, setAccountData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canAfford = userBalance >= product.price;

  const handleBuy = async () => {
    if (!canAfford) {
      setError("Số dư không đủ. Vui lòng nạp thêm tiền.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onBuy(product.id);
      setAccountData(result.accountData);
      setSuccess(true);
      onSuccess();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-green-500/20 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Mua thành công!</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-2">Thông tin tài khoản:</p>
              <div className="flex items-center justify-between space-x-3">
                <code className="text-sm font-mono text-foreground bg-muted px-3 py-2 rounded-lg flex-1 break-all">
                  {accountData}
                </code>
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
                  title="Copy"
                >
                  <Copy className={`h-5 w-5 ${copied ? "text-green-500" : "text-muted-foreground"}`} />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-500 mt-2">Đã copy vào clipboard!</p>
              )}
            </div>

            <div className="glass rounded-xl p-4 border border-cta/20">
              <p className="text-xs text-muted-foreground">
                ⚠️ Vui lòng lưu lại thông tin này. Bạn có thể xem lại trong mục <a href="/dashboard/purchases" className="font-semibold text-cta hover:underline">"Tài khoản đã mua"</a>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-br from-cta/20 to-primary/20 p-3">
              <ShoppingBag className="h-6 w-6 text-cta" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Xác nhận mua hàng</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer"
            disabled={loading}
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

          <div className="flex items-center justify-between glass rounded-xl p-4">
            <div>
              <p className="text-sm text-muted-foreground">Giá:</p>
              <p className="text-2xl font-black text-foreground">{formatNumber(product.price)}đ</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Số dư hiện tại:</p>
              <p className={`text-xl font-bold ${canAfford ? "text-green-500" : "text-red-500"}`}>
                {formatNumber(userBalance)}đ
              </p>
            </div>
          </div>

          {!canAfford && (
            <div className="glass rounded-xl p-4 border border-red-500/20 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-500">Số dư không đủ</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bạn cần thêm {formatNumber(product.price - userBalance)}đ để mua sản phẩm này.
                </p>
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
            className="flex-1 rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleBuy}
            disabled={loading || !canAfford}
            className="flex-1 rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Xác nhận mua"}
          </button>
        </div>
      </div>
    </div>
  );
}
