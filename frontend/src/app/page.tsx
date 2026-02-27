"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, Users, TrendingUp, Star, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Giao dịch tức thì",
    description: "Xử lý đơn hàng tự động 24/7, không cần chờ đợi",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Bảo mật tuyệt đối",
    description: "Mã hóa SSL 256-bit, bảo vệ thông tin tối đa",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Giá tốt nhất",
    description: "Cam kết giá cạnh tranh nhất thị trường",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const stats = [
  { value: "50K+", label: "Khách hàng" },
  { value: "1M+", label: "Đơn hàng" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Đánh giá" },
];

const services = [
  { name: "TikTok", icon: "🎵", desc: "Follow, Like, View" },
  { name: "Facebook", icon: "👍", desc: "Like, Comment, Share" },
  { name: "Instagram", icon: "📷", desc: "Follow, Like, View" },
  { name: "YouTube", icon: "▶️", desc: "Subscribe, View, Like" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 glass-card rounded-2xl border border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cta to-primary text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary">PRIME</span>
                <span className="text-foreground">ACC</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Tính năng
              </Link>
              <Link href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Dịch vụ
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Bảng giá
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-all cursor-pointer">
                Đăng nhập
              </Link>
              <Link href="/dashboard" className="rounded-xl bg-gradient-to-r from-cta to-primary px-4 py-2 text-sm font-bold text-white hover:shadow-lg hover:shadow-cta/30 transition-all cursor-pointer">
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-40 left-20 h-96 w-96 rounded-full bg-cta/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 border border-border">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-foreground">Được tin dùng bởi 50,000+ khách hàng</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Nền tảng dịch vụ <br />
              <span className="bg-gradient-to-r from-cta to-primary bg-clip-text text-transparent">
                SMM & Premium
              </span>
              <br />
              hàng đầu Việt Nam
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tăng tương tác mạng xã hội và mua tài khoản premium với giá tốt nhất. 
              Giao dịch tự động 24/7, bảo mật tuyệt đối.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="group flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cta to-primary px-8 py-4 text-lg font-bold text-white hover:shadow-2xl hover:shadow-cta/30 transition-all cursor-pointer">
                <span>Bắt đầu miễn phí</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#features" className="flex items-center space-x-2 rounded-xl glass border border-border px-8 py-4 text-lg font-semibold text-foreground hover:border-primary/30 transition-all cursor-pointer">
                <span>Tìm hiểu thêm</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-black text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Tại sao chọn PrimeAcc?</h2>
            <p className="text-lg text-muted-foreground">Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group">
                <div className={`inline-flex items-center justify-center rounded-xl ${feature.bg} p-4 mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-lg text-muted-foreground">Hỗ trợ đa nền tảng mạng xã hội phổ biến</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.name} className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-all cursor-pointer group">
                <div className="text-6xl mb-4 transition-transform group-hover:scale-110">{service.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-3xl p-12 text-center bg-gradient-to-br from-cta/10 to-primary/10 border-2 border-cta/30">
            <h2 className="text-4xl font-bold text-foreground mb-4">Sẵn sàng bắt đầu?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tham gia cùng hàng ngàn khách hàng đang sử dụng dịch vụ của chúng tôi
            </p>
            <Link href="/dashboard" className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cta to-primary px-8 py-4 text-lg font-bold text-white hover:shadow-2xl hover:shadow-cta/30 transition-all cursor-pointer">
              <span>Đăng ký miễn phí ngay</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cta to-primary text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">PRIME</span>
                <span className="text-foreground">ACC</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PrimeAcc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
