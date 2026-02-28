"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, Gift, Copy, CheckCircle2, Share2, Award, BookOpen, Crown, Shield, AlertCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { referralApi, ReferralStats, CommissionHistory, CommissionConfig, WithdrawalHistory } from "@/lib/api/referral";

const benefits = [
  { icon: DollarSign, title: "Hoa hồng cao", description: "Nhận 10-20% hoa hồng từ mọi giao dịch", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: TrendingUp, title: "Thu nhập thụ động", description: "Kiếm tiền liên tục từ khách hàng giới thiệu", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Gift, title: "Thưởng khủng", description: "Bonus thêm khi đạt mốc doanh số", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Award, title: "Hỗ trợ 24/7", description: "Đội ngũ hỗ trợ chuyên nghiệp", color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function PartnershipPage() {
  const { isAdmin, isAgent, isMember, isLoading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [history, setHistory] = useState<CommissionHistory[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalHistory[]>([]);
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Check if members are allowed to use partnership features
  const allowMemberPartnership = process.env.NEXT_PUBLIC_ALLOW_MEMBER_PARTNERSHIP === 'true';
  const canUsePartnership = isAdmin || isAgent || (isMember && allowMemberPartnership);
  const showUpgradePrompt = isMember && !allowMemberPartnership;

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    if (canUsePartnership) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [canUsePartnership, isAdmin, isAgent, isMember, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, historyData, configData, withdrawalsData] = await Promise.all([
        referralApi.getStats(),
        referralApi.getHistory(),
        referralApi.getConfig(),
        referralApi.getWithdrawals(),
      ]);
      
      setStats(statsData);
      setHistory(historyData);
      setConfig(configData);
      setWithdrawals(withdrawalsData);
    } catch (error: any) {
      console.error('Failed to load referral data:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tải dữ liệu';
      setError(errorMsg);
      alert('Lỗi: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const referralCode = stats?.referralCode || 'LOADING...';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    alert('Đã sao chép!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      BRONZE: "from-orange-600 to-orange-400",
      SILVER: "from-gray-400 to-gray-300",
      GOLD: "from-yellow-500 to-yellow-400",
      DIAMOND: "from-cyan-500 to-blue-500",
    };
    return colors[tier as keyof typeof colors] || colors.BRONZE;
  };

  const getTierProgress = () => {
    if (!stats || !config) return 0;
    const sales = stats.totalSales;
    const thresholds = {
      SILVER: config.tiers.find(t => t.tier === 'SILVER')?.minSales || 10_000_000,
      GOLD: config.tiers.find(t => t.tier === 'GOLD')?.minSales || 50_000_000,
      DIAMOND: config.tiers.find(t => t.tier === 'DIAMOND')?.minSales || 100_000_000,
    };
    
    if (sales >= thresholds.DIAMOND) return 100;
    if (sales >= thresholds.GOLD) return ((sales - thresholds.GOLD) / (thresholds.DIAMOND - thresholds.GOLD)) * 100;
    if (sales >= thresholds.SILVER) return ((sales - thresholds.SILVER) / (thresholds.GOLD - thresholds.SILVER)) * 100;
    return (sales / thresholds.SILVER) * 100;
  };

  const getNextTierInfo = () => {
    if (!stats || !config) return { tier: 'SILVER', remaining: 10_000_000 };
    const sales = stats.totalSales;
    const thresholds = {
      SILVER: config.tiers.find(t => t.tier === 'SILVER')?.minSales || 10_000_000,
      GOLD: config.tiers.find(t => t.tier === 'GOLD')?.minSales || 50_000_000,
      DIAMOND: config.tiers.find(t => t.tier === 'DIAMOND')?.minSales || 100_000_000,
    };
    
    if (sales >= thresholds.DIAMOND) return { tier: 'DIAMOND', remaining: 0 };
    if (sales >= thresholds.GOLD) return { tier: 'DIAMOND', remaining: thresholds.DIAMOND - sales };
    if (sales >= thresholds.SILVER) return { tier: 'GOLD', remaining: thresholds.GOLD - sales };
    return { tier: 'SILVER', remaining: thresholds.SILVER - sales };
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

      {/* Member-only: Upgrade to Agent Prompt - Show ONLY this if user is Member */}
      {showUpgradePrompt && (
        <>
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
              Liên hệ để nâng cấp
            </button>
          </div>

          {/* Preview benefits for Members */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Lợi ích khi trở thành Đại lý</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="glass rounded-xl p-4 border border-border opacity-60">
                  <div className={`inline-flex items-center justify-center rounded-xl ${benefit.bg} p-3 mb-3`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview commission tiers for Members */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Bảng hoa hồng theo cấp bậc</h3>
            {loading || !config ? (
              <p className="text-center text-muted-foreground py-8">Đang tải...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {config.tiers.map((tier) => (
                  <div key={tier.tier} className="glass rounded-xl p-5 border border-border opacity-60">
                    <div className={`inline-block rounded-lg bg-gradient-to-r ${getTierColor(tier.tier)} px-3 py-1 text-sm font-bold text-white mb-3`}>
                      {tier.tier}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Doanh số: {formatNumber(tier.minSales)}đ - {tier.maxSales ? formatNumber(tier.maxSales) + 'đ' : '∞'}
                    </p>
                    <p className="text-3xl font-black text-foreground">{tier.commissionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Hoa hồng</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
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
          {/* Only show referral section for users with partnership access */}
          {canUsePartnership && (
            <>
              {error && (
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Lỗi tải dữ liệu</h3>
                      <p className="text-sm text-muted-foreground">{error}</p>
                      <button 
                        onClick={loadData}
                        className="mt-2 text-sm text-cta hover:underline cursor-pointer"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
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
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs sm:text-sm font-mono text-foreground break-all line-clamp-2">{referralLink}</code>
                  <button
                    onClick={() => handleCopy(referralLink)}
                    className="ml-2 text-cta hover:text-cta/80 cursor-pointer flex-shrink-0 p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                    aria-label="Copy referral link"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Referral Code</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xl sm:text-2xl font-bold text-foreground">{referralCode}</code>
                  <button
                    onClick={() => handleCopy(referralCode)}
                    className="ml-2 text-cta hover:text-cta/80 cursor-pointer p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                    aria-label="Copy referral code"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="rounded-xl bg-gradient-to-r from-cta to-primary py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-cta/30 cursor-pointer min-h-[48px] active:scale-95 transition-all">
                Chia sẻ Facebook
              </button>
              <button className="rounded-xl glass border border-border py-3 text-sm font-semibold text-foreground hover:border-primary/30 cursor-pointer min-h-[48px] active:scale-95 transition-all">
                Tạo QR Code
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Bảng hoa hồng theo cấp bậc</h3>
            {loading || !config ? (
              <p className="text-center text-muted-foreground py-8">Đang tải...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {config.tiers.map((tier) => (
                  <div key={tier.tier} className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer">
                    <div className={`inline-block rounded-lg bg-gradient-to-r ${getTierColor(tier.tier)} px-3 py-1 text-sm font-bold text-white mb-3`}>
                      {tier.tier}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Doanh số: {formatNumber(tier.minSales)}đ - {tier.maxSales ? formatNumber(tier.maxSales) + 'đ' : '∞'}
                    </p>
                    <p className="text-3xl font-black text-foreground">{tier.commissionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Hoa hồng</p>
                  </div>
                ))}
              </div>
            )}
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

          {/* Commission history - only for users with partnership access */}
          {canUsePartnership && (
            <>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Lịch sử hoa hồng</h3>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Đang tải...</p>
                ) : !history || history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Chưa có hoa hồng nào</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between glass rounded-xl p-4 border border-border">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{commission.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {commission.orderType === 'ACCOUNT_PURCHASE' ? 'Mua tài khoản' : 'Đơn SMM'} • 
                              {new Date(commission.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-green-500">+{formatNumber(commission.commissionAmount)}đ</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Withdrawal history */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Lịch sử rút tiền</h3>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Đang tải...</p>
                ) : !withdrawals || withdrawals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Chưa có yêu cầu rút tiền nào</p>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal) => {
                      const statusConfig = {
                        PENDING: { color: 'text-yellow-600 bg-yellow-100', label: 'Chờ duyệt' },
                        APPROVED: { color: 'text-blue-600 bg-blue-100', label: 'Đã duyệt' },
                        COMPLETED: { color: 'text-green-600 bg-green-100', label: 'Hoàn thành' },
                        REJECTED: { color: 'text-red-600 bg-red-100', label: 'Từ chối' },
                      };
                      const status = statusConfig[withdrawal.status as keyof typeof statusConfig] || statusConfig.PENDING;

                      return (
                        <div key={withdrawal.id} className="glass rounded-xl p-4 border border-border">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="text-sm font-bold text-foreground">{formatNumber(withdrawal.amount)}đ</p>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>Ngân hàng: {withdrawal.bankName} - {withdrawal.bankAccount}</p>
                            <p>Chủ TK: {withdrawal.bankAccountName}</p>
                            <p>Ngày tạo: {new Date(withdrawal.createdAt).toLocaleString('vi-VN')}</p>
                            {withdrawal.processedAt && (
                              <p>Xử lý: {new Date(withdrawal.processedAt).toLocaleString('vi-VN')}</p>
                            )}
                            {withdrawal.note && (
                              <p className="text-red-600">Ghi chú: {withdrawal.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
            </>
          )}
        </div>

        <div className="space-y-6">
          {/* Stats sidebar - only for users with partnership access */}
          {canUsePartnership && (
            <>
              <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Thống kê của bạn</h3>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Tổng người giới thiệu</p>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats?.totalReferrals || 0}</p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="text-xs text-muted-foreground">Doanh số tháng này</p>
                </div>
                <p className="text-3xl font-bold text-foreground">{formatNumber(stats?.monthlySales || 0)}đ</p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <p className="text-xs text-muted-foreground">Hoa hồng tháng này</p>
                </div>
                <p className="text-3xl font-bold text-purple-500">{formatNumber(stats?.monthlyCommission || 0)}đ</p>
              </div>

              <div className="glass rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Cấp bậc hiện tại</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.commissionTier || 'BRONZE'}</p>
                <div className="mt-3 h-2 w-full rounded-full bg-border overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getTierColor(stats?.commissionTier || 'BRONZE')} rounded-full transition-all`}
                    style={{ width: `${getTierProgress()}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {getNextTierInfo().remaining > 0 
                    ? `Còn ${formatNumber(getNextTierInfo().remaining)}đ để lên ${getNextTierInfo().tier}`
                    : 'Đã đạt cấp cao nhất!'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-foreground">Rút hoa hồng</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Số dư khả dụng</p>
            <p className="text-3xl font-black text-foreground mb-4">{formatNumber(stats?.commissionBalance || 0)}đ</p>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              disabled={(stats?.commissionBalance || 0) < 100000}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-green-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(stats?.commissionBalance || 0) < 100000 ? 'Tối thiểu 100,000đ' : 'Rút tiền ngay'}
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

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <WithdrawalModal
          balance={stats?.commissionBalance || 0}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            loadData();
            alert('Yêu cầu rút tiền đã được gửi thành công!');
          }}
        />
      )}
    </div>
  );
}

function WithdrawalModal({
  balance,
  onClose,
  onSuccess,
}: {
  balance: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);

    // Validation
    if (withdrawAmount < 100000) {
      alert('Số tiền rút tối thiểu là 100,000đ');
      return;
    }

    if (withdrawAmount > balance) {
      alert('Số dư không đủ');
      return;
    }

    if (!bankName || !bankAccount || !bankAccountName) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending withdrawal request:', {
        amount: withdrawAmount,
        bankName,
        bankAccount,
        bankAccountName,
      });
      
      const result = await referralApi.requestWithdrawal({
        amount: withdrawAmount,
        bankName,
        bankAccount,
        bankAccountName,
      });
      
      console.log('Withdrawal success:', result);
      alert('Yêu cầu rút tiền đã được gửi thành công!');
      onSuccess();
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      alert('Lỗi: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Rút hoa hồng</h2>

        <div className="mb-4 p-4 glass rounded-xl">
          <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
          <p className="text-2xl font-bold text-green-500">{formatNumber(balance)}đ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số tiền rút (tối thiểu 100,000đ)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền..."
              className="w-full px-4 py-2 glass border border-border rounded-xl focus:ring-2 focus:ring-cta focus:border-cta bg-background text-foreground"
              required
              min="100000"
              max={balance}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ngân hàng</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-2 glass border border-border rounded-xl focus:ring-2 focus:ring-cta focus:border-cta bg-background text-foreground cursor-pointer"
              required
            >
              <option value="">Chọn ngân hàng</option>
              <option value="Vietcombank">Vietcombank</option>
              <option value="VietinBank">VietinBank</option>
              <option value="BIDV">BIDV</option>
              <option value="Agribank">Agribank</option>
              <option value="Techcombank">Techcombank</option>
              <option value="MB Bank">MB Bank</option>
              <option value="ACB">ACB</option>
              <option value="VPBank">VPBank</option>
              <option value="TPBank">TPBank</option>
              <option value="Sacombank">Sacombank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Số tài khoản</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Nhập số tài khoản..."
              className="w-full px-4 py-2 glass border border-border rounded-xl focus:ring-2 focus:ring-cta focus:border-cta bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tên chủ tài khoản</label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
              placeholder="NGUYEN VAN A"
              className="w-full px-4 py-2 glass border border-border rounded-xl focus:ring-2 focus:ring-cta focus:border-cta bg-background text-foreground uppercase"
              required
            />
          </div>

          <div className="p-4 glass rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-muted-foreground">
              ⚠️ Yêu cầu rút tiền sẽ được xử lý trong vòng 24-48 giờ làm việc. Vui lòng kiểm tra kỹ thông tin ngân hàng trước khi gửi.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 glass border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer font-medium text-foreground"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all cursor-pointer font-medium disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
