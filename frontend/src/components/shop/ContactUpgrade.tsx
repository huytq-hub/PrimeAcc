"use client";

import { useState } from "react";
import { Shield, Mail, MessageCircle, Phone, CheckCircle, ChevronDown, ChevronUp, Send, Loader2, ShieldCheck } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Tài khoản chính chủ là gì?",
    answer: "Tài khoản chính chủ là tài khoản được xác minh qua Gmail cá nhân, có độ tin cậy cao hơn, được ưu tiên hỗ trợ và có thể truy cập các tính năng đặc biệt."
  },
  {
    question: "Lợi ích khi nâng cấp tài khoản chính chủ?",
    answer: "Bạn sẽ nhận được: Hỗ trợ ưu tiên 24/7, giảm giá đặc biệt cho các sản phẩm premium, bảo mật nâng cao với 2FA, và quyền truy cập sớm vào các tính năng mới."
  },
  {
    question: "Quy trình xác minh mất bao lâu?",
    answer: "Quy trình xác minh thường hoàn tất trong vòng 24-48 giờ làm việc sau khi bạn gửi đầy đủ thông tin Gmail và mã 2FA."
  },
  {
    question: "Thông tin nào cần cung cấp?",
    answer: "Bạn chỉ cần cung cấp: Gmail cá nhân, mật khẩu, mã 2FA (nếu có), và số điện thoại liên hệ. Không cần giấy tờ tùy thân."
  }
];

export default function ContactUpgrade() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
    twoFA: "",
    phone: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ gmail: "", password: "", twoFA: "", phone: "", note: "" });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden glass-card rounded-2xl p-8 border border-primary/20">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="glass rounded-2xl p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Nâng cấp Tài khoản Chính chủ</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Xác minh danh tính để trở thành thành viên ưu tiên với nhiều đặc quyền và ưu đãi độc quyền.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all duration-700" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cta/10 blur-3xl transition-all duration-700" />
      </div>

      {/* Benefits Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Shield,
            title: "Bảo mật nâng cao",
            description: "Xác thực 2 lớp và bảo vệ tài khoản tối đa",
            color: "text-blue-500"
          },
          {
            icon: CheckCircle,
            title: "Ưu tiên hỗ trợ",
            description: "Hỗ trợ 24/7 với thời gian phản hồi < 1 giờ",
            color: "text-green-500"
          },
          {
            icon: MessageCircle,
            title: "Giảm giá đặc biệt",
            description: "Giảm 10-20% cho tất cả sản phẩm premium",
            color: "text-purple-500"
          }
        ].map((benefit, index) => (
          <div
            key={index}
            className="group relative overflow-hidden glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 cursor-pointer"
          >
            <benefit.icon className={`h-10 w-10 ${benefit.color} mb-4 transition-transform duration-300 group-hover:scale-110`} />
            <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="glass-card rounded-2xl p-8 border border-border">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 text-primary mr-3" />
          Câu hỏi thường gặp
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200 hover:bg-primary/5 cursor-pointer"
              >
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-400 ${
                  expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="glass-card rounded-2xl p-8 border border-border">
        <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Mail className="h-6 w-6 text-primary mr-3" />
          Gửi thông tin nâng cấp
        </h3>
        <p className="text-muted-foreground mb-6">
          Cung cấp thông tin Gmail và 2FA để xác minh tài khoản chính chủ. Chúng tôi sẽ liên hệ trong vòng 24 giờ.
        </p>

        {submitSuccess && (
          <div className="mb-6 glass rounded-xl p-4 border border-green-500/30 bg-green-500/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="gmail" className="block text-sm font-semibold text-foreground mb-2">
                Gmail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="gmail"
                required
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0912345678"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Mật khẩu Gmail <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="twoFA" className="block text-sm font-semibold text-foreground mb-2">
                Mã 2FA (nếu có)
              </label>
              <input
                type="text"
                id="twoFA"
                value={formData.twoFA}
                onChange={(e) => setFormData({ ...formData, twoFA: e.target.value })}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="XXXX XXXX XXXX XXXX"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-semibold text-foreground mb-2">
              Ghi chú thêm
            </label>
            <textarea
              id="note"
              rows={4}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Thông tin bổ sung (nếu có)..."
            />
          </div>

          <div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-semibold mb-1">Bảo mật thông tin</p>
                <p className="text-xs">Thông tin của bạn được mã hóa và chỉ dùng để xác minh tài khoản. Chúng tôi cam kết không chia sẻ với bên thứ ba.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cta to-primary px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cta/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Gửi yêu cầu nâng cấp</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Alternative Contact Methods */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg cursor-pointer">
          <div className="flex items-start space-x-4">
            <div className="glass rounded-xl p-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Hotline hỗ trợ</h4>
              <p className="text-sm text-muted-foreground mb-2">Liên hệ trực tiếp qua điện thoại</p>
              <a href="tel:1900xxxx" className="text-primary font-semibold hover:underline">
                1900 xxxx
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg cursor-pointer">
          <div className="flex items-start space-x-4">
            <div className="glass rounded-xl p-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Chat trực tuyến</h4>
              <p className="text-sm text-muted-foreground mb-2">Hỗ trợ nhanh qua Telegram</p>
              <a href="https://t.me/support" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                @primeacc_support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
