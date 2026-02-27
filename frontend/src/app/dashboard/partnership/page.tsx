"use client";

import { useState } from "react";
import { Users, TrendingUp, DollarSign, Gift, Copy, CheckCircle2, Share2, Award, BookOpen, Crown, Shield, AlertCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const benefits = [
  { icon: DollarSign, title: "Hoa hồng cao", description: "Nhận 10-20% hoa hồng từ mọi giao dịch", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: TrendingUp, title: "Thu nhập thụ động", description: "Kiếm tiền liên tục từ khách hàng giới thiệu", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Gift, title: "Thưởng khủng", description: "Bonus thêm khi đạt mốc doanh số", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Award, title: "Hỗ trợ 24/7", description: "Đội ngũ hỗ trợ chuyên nghiệp", color: "text-orange-500", bg: "bg-orange-500/10" },
];

const commissionTiers = [
  { level: "Bronze", sales: "0 - 10M", commission: "10%", color: "from-orange-600 to-orange-400" },
  { level: "Silver", sales: "10M - 50M", commission: "15%", color: "from-gray-400 to-gray-300" },
  { level: "Gold", sales: "50M - 100M", commission: "18%", color: "from-yellow-500 to-yellow-400" },
  { level: "Diamond", sales: "100M+", commission: "20%", color: "from-cyan-500 to-blue-500" },
];

export default function PartnershipPage() {
  const { isAdmin, isAgent, isMember, hasRole } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralLink = "https://primeacc.com/ref/ABC123XYZ";
  const referralCode = "ABC123XYZ";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Chương trình Cộng tác viên</h1>
          <Users className="h-7 w-7 text-primary" />
          {isAdmin && <Crown className="h-6 w-6 text-yellow-500" />}
          {isAgent && <Shield className="h-6 w-6 text-blue-500" />}
        </div>
        <p className="mt-2 text-muted-foreground">
          Kiếm tiền cùng PrimeAcc với hoa hồng hấp dẫn lên đến 20%.
          {isAdmin && " (Xem tất cả thống kê hệ thống)"}
        </p>
      </div>

      {/* Member-only: Upgrade to Agent Prompt */}
      {isMember && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Nâng cấp lên Đại lý để sử dụng tính năng này</h3>
              <p className="text-sm text-muted-foreground">Bạn cần có tài khoản Đại lý để tham gia chương trình cộng tác viên</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Hoa hồng</p>
              <p className="text-2xl font-bold text-green-500">10-20%</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Thu nhập</p>
              <p className="text-2xl font-bold text-blue-500">Thụ động</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Hỗ trợ</p>
              <p className="text-2xl font-bold text-purple-500">24/7</p>
            </div>
          </div>
          <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer">
            Nâng cấp ngay
          </button>
        </div>
      )}

      {/* Admin-only: System-wide Partnership Stats */}
      {isAdmin && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-bold text-foreground">Thống kê hệ thống (Admin)</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Tổng đại lý</p>
              <p className="text-2xl font-bold text-foreground">342</p>
              <p className="text-xs text-green-500 mt-1">+12 tuần này</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Hoa hồng đã trả</p>
              <p className="text-2xl font-bold text-foreground">45.2M đ</p>
              <p className="text-xs text-blue-500 mt-1">Tháng này</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Doanh số từ ref</p>
              <p className="text-2xl font-bold text-foreground">280M đ</p>
              <p className="text-xs text-purple-500 mt-1">Tháng này</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-foreground">18.5%</p>
              <p className="text-xs text-green-500 mt-1">+2.3%</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Only show referral section for Agents and Admins */}
          {(isAgent || isAdmin) && (
            <>
              <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-cta/10 to-primary/10 border-2 border-cta/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Share2 className="h-6 w-6 text-cta" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Link giới thiệu của bạn</h3>
                <p className="text-sm text-muted-foreground">Chia sẻ link này để nhận hoa hồng</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Referral Link</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-foreground break-all">{referralLink}</code>
                  <button
                    onClick={() => handleCopy(referralLink)}
                    className="ml-4 text-cta hover:text-cta/80 cursor-pointer flex-shrink-0"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Referral Code</p>
                <div className="flex items-center justify-between">
                  <code className="text-2xl font-bold text-foreground">{referralCode}</code>
                  <button
                    onClick={() => handleCopy(referralCode)}
                    className="ml-4 text-cta hover:text-cta/80 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-xl bg-gradient-to-r from-cta to-primary py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-cta/30 cursor-pointer">
                Chia sẻ Facebook
              </button>
              <button className="rounded-xl glass border border-border py-3 text-sm font-semibold text-foreground hover:border-primary/30 cursor-pointer">
                Tạo QR Code
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Bảng hoa hồng theo cấp bậc</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {commissionTiers.map((tier) => (
                <div key={tier.level} className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className={`inline-block rounded-lg bg-gradient-to-r ${tier.color} px-3 py-1 text-sm font-bold text-white mb-3`}>
                    {tier.level}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Doanh số: {tier.sales}</p>
                  <p className="text-3xl font-black text-foreground">{tier.commission}</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoa hồng</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Lợi ích khi tham gia</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="glass rounded-xl p-4 border border-border">
                  <div className={`inline-flex items-center justify-center rounded-xl ${benefit.bg} p-3 mb-3`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commission history - only for Agents and Admins */}
          {(isAgent || isAdmin) && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Lịch sử hoa hồng</h3>
              <div className="space-y-3">
                {[
                  { user: "user123", amount: 45000, date: "25/02/2024", type: "Đơn SMM" },
                  { user: "user456", amount: 18000, date: "24/02/2024", type: "Mua tài khoản" },
                  { user: "user789", amount: 32000, date: "23/02/2024", type: "Đơn SMM" },
                ].map((commission, i) => (
                  <div key={i} className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{commission.user}</p>
                        <p className="text-xs text-muted-foreground">{commission.type} • {commission.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-green-500">+{formatNumber(commission.amount)}đ</p>
                  </div>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>

        <div className="space-y-6">
          {/* Stats sidebar - only for Agents and Admins */}
          {(isAgent || isAdmin) && (
            <>
              <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Thống kê của bạn</h3>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Tổng người giới thiệu</p>
                </div>
                <p className="text-3xl font-bold text-foreground">24</p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="text-xs text-muted-foreground">Doanh số tháng này</p>
                </div>
                <p className="text-3xl font-bold text-foreground">8.5M</p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <p className="text-xs text-muted-foreground">Hoa hồng tháng này</p>
                </div>
                <p className="text-3xl font-bold text-purple-500">1.2M</p>
              </div>

              <div className="glass rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Cấp bậc hiện tại</p>
                </div>
                <p className="text-2xl font-bold text-foreground">Silver</p>
                <div className="mt-3 h-2 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Còn 1.5M để lên Gold</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-foreground">Rút hoa hồng</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Số dư khả dụng</p>
            <p className="text-3xl font-black text-foreground mb-4">1,250,000đ</p>
            <button className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-green-500/30 cursor-pointer">
              Rút tiền ngay
            </button>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Hướng dẫn</h3>
            </div>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-cta/10 text-cta font-bold text-xs">1</span>
                <span>Chia sẻ link giới thiệu của bạn</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-cta/10 text-cta font-bold text-xs">2</span>
                <span>Người dùng đăng ký qua link của bạn</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-cta/10 text-cta font-bold text-xs">3</span>
                <span>Nhận hoa hồng từ mọi giao dịch của họ</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-cta/10 text-cta font-bold text-xs">4</span>
                <span>Rút tiền về tài khoản bất cứ lúc nào</span>
              </li>
            </ol>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
