"use client";

import { useState } from "react";
import { CreditCard, Wallet, QrCode, Copy, CheckCircle2, AlertCircle, DollarSign, Zap, Gift } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const paymentMethods = [
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: CreditCard, fee: "0%", instant: true },
  { id: "momo", name: "Ví MoMo", icon: Wallet, fee: "0%", instant: true },
  { id: "card", name: "Thẻ ATM/Visa", icon: CreditCard, fee: "2%", instant: false },
];

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const bankInfo = {
    bank: "MB Bank",
    accountNumber: "0123456789",
    accountName: "NGUYEN VAN A",
    content: `NAP ${Math.random().toString(36).substring(7).toUpperCase()}`,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center space-y-3 rounded-xl p-4 transition-all cursor-pointer ${
                    selectedMethod === method.id
                      ? "bg-gradient-to-br from-cta/20 to-primary/20 border-2 border-cta"
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
                  {method.instant && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                      Tức thì
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
                  type="number"
                  placeholder="Nhập số tiền"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 w-full rounded-xl border border-border glass pl-4 pr-16 text-lg font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">VNĐ</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50000, 100000, 200000, 500000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="rounded-lg glass border border-border py-2 text-sm font-semibold text-foreground hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                  >
                    {formatNumber(preset / 1000)}K
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedMethod === "bank" && amount && (
            <div className="glass-card rounded-2xl p-6 border-2 border-cta/30">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-cta" />
                <h3 className="text-lg font-bold text-foreground">Thông tin chuyển khoản</h3>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Ngân hàng</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">{bankInfo.bank}</p>
                    <button onClick={() => handleCopy(bankInfo.bank)} className="text-cta hover:text-cta/80 cursor-pointer">
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Số tài khoản</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">{bankInfo.accountNumber}</p>
                    <button onClick={() => handleCopy(bankInfo.accountNumber)} className="text-cta hover:text-cta/80 cursor-pointer">
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Chủ tài khoản</p>
                  <p className="text-lg font-bold text-foreground">{bankInfo.accountName}</p>
                </div>

                <div className="glass rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30">
                  <p className="text-xs text-muted-foreground mb-1">Nội dung chuyển khoản (BẮT BUỘC)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-foreground">{bankInfo.content}</p>
                    <button onClick={() => handleCopy(bankInfo.content)} className="text-cta hover:text-cta/80 cursor-pointer">
                      {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Số tiền</p>
                  <p className="text-2xl font-black text-cta">{formatNumber(parseInt(amount))} VNĐ</p>
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
            <div className="space-y-3">
              {[
                { amount: 500000, date: "25/02/2024 14:30", status: "success" },
                { amount: 200000, date: "23/02/2024 09:15", status: "success" },
                { amount: 100000, date: "20/02/2024 16:45", status: "pending" },
              ].map((transaction, i) => (
                <div key={i} className="glass rounded-xl p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">+{formatNumber(transaction.amount)}đ</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      transaction.status === "success" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-orange-500/10 text-orange-500"
                    }`}>
                      {transaction.status === "success" ? "Thành công" : "Đang xử lý"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-foreground">Khuyến mãi</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Nạp từ 500K nhận thêm 5% giá trị</p>
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
