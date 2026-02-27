"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, ArrowRight, Github, Sparkles, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-cta/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cta to-primary text-white">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="text-primary">PRIME</span>
              <span className="text-foreground">ACC</span>
            </h1>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
              Nền tảng dịch vụ SMM & Tài khoản Premium hàng đầu
            </h2>
            <p className="text-lg text-muted-foreground">
              Tăng tương tác mạng xã hội và mua tài khoản premium với giá tốt nhất thị trường.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, title: "Bảo mật tuyệt đối", desc: "Mã hóa SSL 256-bit" },
              { icon: Zap, title: "Giao dịch tức thì", desc: "Xử lý tự động 24/7" },
              { icon: Sparkles, title: "Hoa hồng hấp dẫn", desc: "Lên đến 20% cho CTV" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4 glass rounded-xl p-4">
                <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-cta/20 to-primary/20 p-3">
                  <feature.icon className="h-6 w-6 text-cta" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass-card rounded-3xl p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cta to-primary text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">
                  <span className="text-primary">PRIME</span>
                  <span className="text-foreground">ACC</span>
                </h2>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Đăng nhập</h3>
              <p className="mt-2 text-sm text-muted-foreground">Chào mừng bạn quay trở lại!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Tên đăng nhập"
                    className="h-12 w-full rounded-xl border border-border glass pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input 
                    type="password" 
                    placeholder="Mật khẩu"
                    className="h-12 w-full rounded-xl border border-border glass pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember"
                    className="h-4 w-4 rounded border-border text-cta focus:ring-cta cursor-pointer" 
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground cursor-pointer">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link href="#" className="text-sm font-semibold text-cta hover:text-cta/80 cursor-pointer">
                  Quên mật khẩu?
                </Link>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cta to-primary text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-98 cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span>Đăng nhập ngay</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center text-xs text-muted-foreground">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-4">Hoặc đăng nhập với</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex h-11 items-center justify-center rounded-xl border border-border glass text-sm font-medium text-foreground transition-all hover:border-primary/30 cursor-pointer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </button>
              <button className="flex h-11 items-center justify-center rounded-xl border border-border glass text-sm font-medium text-foreground transition-all hover:border-primary/30 cursor-pointer">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-cta hover:text-cta/80 cursor-pointer">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
