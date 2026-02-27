"use client";

import { useState } from "react";
import { Code, Key, BookOpen, Copy, CheckCircle2, ExternalLink } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/smm/order",
    description: "Tạo đơn hàng SMM mới",
    params: ["service_id", "quantity", "target_url"],
  },
  {
    method: "GET",
    path: "/api/smm/orders",
    description: "Lấy danh sách đơn hàng",
    params: ["page", "limit"],
  },
  {
    method: "GET",
    path: "/api/smm/services",
    description: "Lấy danh sách dịch vụ",
    params: ["category"],
  },
  {
    method: "GET",
    path: "/api/user/balance",
    description: "Kiểm tra số dư tài khoản",
    params: [],
  },
];

export default function ApiPage() {
  const [copied, setCopied] = useState(false);
  const apiKey = "pk_live_1234567890abcdefghijklmnop";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleCode = `// Example: Create SMM Order
const response = await fetch('https://api.primeacc.com/api/smm/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    service_id: 'srv_123',
    quantity: 1000,
    target_url: 'https://tiktok.com/@username'
  })
});

const data = await response.json();
console.log(data);`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tài liệu API 📚</h1>
        <p className="mt-2 text-muted-foreground">Tích hợp dịch vụ vào hệ thống của bạn với API RESTful.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Key className="h-6 w-6 text-cta" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">API Key của bạn</h3>
                <p className="text-sm text-muted-foreground">Sử dụng key này để xác thực các request</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border-2 border-cta/30">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-foreground">{apiKey}</code>
                <button
                  onClick={() => handleCopy(apiKey)}
                  className="ml-4 text-cta hover:text-cta/80 cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <p className="text-sm text-foreground">
                ⚠️ Không chia sẻ API key với bất kỳ ai. Key này có quyền truy cập đầy đủ vào tài khoản của bạn.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">API Endpoints</h3>
            </div>

            <div className="space-y-3">
              {endpoints.map((endpoint, i) => (
                <div key={i} className="glass rounded-xl p-4 border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`rounded-lg px-2 py-1 text-xs font-bold ${
                        endpoint.method === "POST" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                  {endpoint.params.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param) => (
                        <span key={param} className="rounded-full bg-accent px-2 py-0.5 text-xs font-mono text-muted-foreground">
                          {param}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="glass rounded-xl p-3">
                <Code className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Code Example</h3>
            </div>

            <div className="relative">
              <pre className="glass rounded-xl p-4 overflow-x-auto border border-border">
                <code className="text-sm font-mono text-foreground">{exampleCode}</code>
              </pre>
              <button
                onClick={() => handleCopy(exampleCode)}
                className="absolute top-4 right-4 glass rounded-lg p-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Thống kê API</h3>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Requests hôm nay</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Rate limit</p>
                <p className="text-2xl font-bold text-foreground">100/phút</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Success rate</p>
                <p className="text-2xl font-bold text-green-500">99.8%</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30">
            <h3 className="text-lg font-bold text-foreground mb-2">📖 Full Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Xem tài liệu đầy đủ với ví dụ chi tiết cho mọi ngôn ngữ lập trình.
            </p>
            <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer">
              Xem tài liệu đầy đủ
            </button>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Webhooks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nhận thông báo real-time khi đơn hàng thay đổi trạng thái.
            </p>
            <button className="w-full rounded-xl glass border border-border py-2.5 text-sm font-semibold text-foreground hover:border-primary/30 cursor-pointer">
              Cấu hình Webhook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
