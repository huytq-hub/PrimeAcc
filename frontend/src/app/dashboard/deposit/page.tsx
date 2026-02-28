"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, QrCode, Copy, CheckCircle2, AlertCircle, DollarSign, Zap, Gift, RefreshCw } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { paymentApi, type DepositQRResponse, type DepositHistory } from "@/lib/api/payment";
import Image from "next/image";

const paymentMethods = [
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: CreditCard, fee: "0%", instant: true },
  { id: "momo", name: "Ví MoMo", icon: Wallet, fee: "0%", instant: true, disabled: true },
  { id: "card", name: "Thẻ ATM/Visa", icon: CreditCard, fee: "2%", instant: false, disabled: true },
];

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [qrData, setQrData] = useState<DepositQRResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DepositHistory[]>([]);
  const [qrExpired, setQrExpired] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (qrData) {
      const expiresAt = new Date(qrData.expiresAt).getTime();
      const now = Date.now();
      const timeLeft = expiresAt - now;

      if (timeLeft > 0) {
        setQrExpired(false);
        const timer = setTimeout(() => {
          setQrExpired(true);
        }, timeLeft);
        return () => clearTimeout(timer);
      } else {
        setQrExpired(true);
      }
    }
  }, [qrData]);

  const loadHistory = async () => {
    try {
      const data = await paymentApi.getHistory(10);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleGenerateQR = async () => {
    const numAmount = parseInt(amount);
    
    if (!amount || isNaN(numAmount)) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (numAmount < 10000) {
      alert("Số tiền tối thiểu là 10,000đ");
      return;
    }

    if (numAmount > 50000000) {
      alert("Số tiền tối đa là 50,000,000đ");
      return;
    }

    setLoading(true);
    try {
      const data = await paymentApi.generateQR(numAmount);
      setQrData(data);
      setQrExpired(false);
    } catch (error: any) {
      console.error("Failed to generate QR:", error);
      alert(error.message || "Không thể tạo mã QR. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRefreshQR = () => {
    handleGenerateQR();
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nạp tiền vào tài khoản</h1>
          <DollarSign className="h-7 w-7 text-green-500" />
        </div>
        <p className="mt-2 text-muted-foreground">Chọn phương thức thanh toán và nạp tiền ngay lập tức.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Chọn phương thức thanh toán</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => !method.disabled && setSelectedMethod(method.id)}
                  disabled={method.disabled}
                  className={`flex flex-col items-center space-y-3 rounded-xl p-4 transition-all duration-400 cursor-pointer ${
                    selectedMethod === method.id
                      ? "bg-gradient-to-br from-cta/20 to-primary/20 border-2 border-cta scale-[1.02] shadow-[0_0_0_4px_rgba(34,197,94,0.1)]"
                      : method.disabled
                      ? "glass border border-border opacity-50 cursor-not-allowed"
                      : "glass border border-border hover:border-primary/30"
                  }`}
                >
                  <method.icon className={`h-8 w-8 ${selectedMethod === method.id ? "text-cta" : "text-muted-foreground"}`} />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${selectedMethod === method.id ? "text-foreground" : "text-muted-foreground"}`}>
                      {method.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Phí: {method.fee}</p>
                  </div>
                  {method.instant && !method.disabled && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                      Tức thì
                    </span>
                  )}
                  {method.disabled && (
                    <span className="rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                      Sắp ra mắt
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Số tiền nạp</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Nhập số tiền"
                  value={amount ? formatNumber(parseInt(amount)) : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(value);
                  }}
                  onBlur={() => {
                    const numAmount = parseInt(amount);
                    if (numAmount && numAmount < 10000) {
                      alert("Số tiền tối thiểu là 10,000đ");
                      setAmount("10000");
                    } else if (numAmount && numAmount > 50000000) {
                      alert("Số tiền tối đa là 50,000,000đ");
                      setAmount("50000000");
                    }
                  }}
                  className="h-14 sm:h-16 lg:h-[72px] w-full rounded-xl border-2 border-primary/20 glass pl-4 pr-16 text-xl sm:text-2xl font-bold placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_6px_rgba(124,58,237,0.1)] focus:scale-[1.01] transition-all duration-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm sm:text-base">VNĐ</span>
              </div>

              {amount && (parseInt(amount) < 10000 || parseInt(amount) > 50000000) && (
                <div className="flex items-center space-x-2 text-sm text-orange-500 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>
                    {parseInt(amount) < 10000 
                      ? "Số tiền tối thiểu là 10,000đ" 
                      : "Số tiền tối đa là 50,000,000đ"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {[50000, 100000, 200000, 500000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`rounded-lg glass border py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      amount === preset.toString()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    {formatNumber(preset / 1000)}K
                  </button>
                ))}
              </div>

              {selectedMethod === "bank" && amount && parseInt(amount) >= 10000 && parseInt(amount) <= 50000000 && (
                <button
                  onClick={handleGenerateQR}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-cta to-primary py-3 text-base font-bold text-white hover:shadow-lg hover:shadow-cta/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="h-5 w-5" />
                      <span>{qrData ? "Tạo lại mã QR" : "Tạo mã QR thanh toán"}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {selectedMethod === "bank" && qrData && (
            <div className={`glass-card rounded-2xl p-6 border-2 transition-all duration-400 ${
              qrExpired ? "border-orange-500/30" : "border-cta/30"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`h-5 w-5 ${qrExpired ? "text-orange-500" : "text-cta"}`} />
                  <h3 className="text-lg font-bold text-foreground">Thông tin chuyển khoản</h3>
                </div>
                {qrExpired && (
                  <button
                    onClick={handleRefreshQR}
                    className="flex items-center space-x-1 text-sm text-orange-500 hover:text-orange-600 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Làm mới</span>
                  </button>
                )}
              </div>

              {qrExpired && (
                <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm text-orange-500 font-semibold">
                    Mã QR đã hết hạn. Vui lòng tạo lại mã QR mới.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className={`relative p-3 sm:p-4 rounded-2xl bg-white transition-all duration-300 w-full max-w-[280px] mx-auto ${
                    qrExpired ? "opacity-50 grayscale" : ""
                  }`}>
                    <Image
                      src={qrData.qrUrl}
                      alt="QR Code thanh toán"
                      width={240}
                      height={240}
                      className="rounded-xl w-full h-auto"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center px-4">
                    Quét mã QR bằng app ngân hàng để thanh toán
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Ngân hàng</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base sm:text-lg font-bold text-foreground truncate">{qrData.bankInfo.bank}</p>
                      <button
                        onClick={() => handleCopy(qrData.bankInfo.bank, "bank")}
                        className="text-cta hover:text-cta/80 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 active:scale-95"
                        aria-label="Copy bank name"
                      >
                        {copied === "bank" ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Số tài khoản</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base sm:text-lg font-bold text-foreground">{qrData.bankInfo.accountNumber}</p>
                      <button
                        onClick={() => handleCopy(qrData.bankInfo.accountNumber, "account")}
                        className="text-cta hover:text-cta/80 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 active:scale-95"
                        aria-label="Copy account number"
                      >
                        {copied === "account" ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Chủ tài khoản</p>
                    <p className="text-base sm:text-lg font-bold text-foreground">{qrData.bankInfo.accountName}</p>
                  </div>

                  <div className="glass rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30">
                    <p className="text-xs text-muted-foreground mb-1">Nội dung chuyển khoản (BẮT BUỘC)</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-lg sm:text-xl font-black text-foreground break-all">{qrData.bankInfo.transferContent}</p>
                      <button
                        onClick={() => handleCopy(qrData.bankInfo.transferContent, "content")}
                        className="text-cta hover:text-cta/80 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 active:scale-95"
                        aria-label="Copy transfer content"
                      >
                        {copied === "content" ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Số tiền</p>
                    <p className="text-2xl font-black text-cta">{formatNumber(qrData.bankInfo.amount)} VNĐ</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start space-x-2">
                  <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Tài khoản sẽ được cộng tiền tự động trong vòng 1-3 phút sau khi chuyển khoản thành công.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Lịch sử nạp tiền</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-3">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
                </div>
              ) : (
                history.map((transaction) => (
                  <div key={transaction.id} className="glass rounded-xl p-3 border border-border hover:border-primary/30 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-cta">+{formatNumber(Number(transaction.amount))}đ</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(transaction.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${
                          transaction.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-500 border border-green-500/30"
                            : transaction.status === "PENDING"
                            ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                            : "bg-red-500/10 text-red-500 border border-red-500/30"
                        }`}
                      >
                        {transaction.status === "COMPLETED" ? "Thành công" : transaction.status === "PENDING" ? "Đang xử lý" : "Thất bại"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-foreground">Khuyến mãi</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Nạp từ 500K nhận thêm 5% giá trị</p>
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 cursor-pointer">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
