# PrimeAcc - Nền tảng SMM & Bán Tài Khoản Premium

Ứng dụng full-stack cho dịch vụ SMM (Social Media Marketing) và bán tài khoản premium với tích hợp thanh toán tự động.

## ✨ Tính năng chính

### 🎯 Dịch vụ SMM
- Catalog dịch vụ tăng like, follow, view cho các nền tảng social media
- Hệ thống đặt hàng và theo dõi tiến độ
- API integration cho automation

### 🛍️ Shop Tài Khoản Premium
- Bán tài khoản Netflix, Spotify, Canva, ChatGPT, Youtube, Adobe
- Giao hàng tự động 24/7
- Quản lý stock và inventory
- Lock mechanism chống race condition

### 💰 Nạp tiền tự động (Sepay)
- Tạo QR code thanh toán VietQR
- Webhook tự động cộng tiền từ Sepay
- Lịch sử giao dịch chi tiết
- Hỗ trợ VietinBank và các ngân hàng khác

### 🤝 Chương trình Đối tác
- Hệ thống referral với mã giới thiệu
- Tính hoa hồng tự động
- Dashboard theo dõi doanh thu

### 🔧 API Documentation
- RESTful API với JWT authentication
- Swagger/OpenAPI documentation
- Code examples và testing tools

### 🎨 UI/UX Modern
- Glassmorphism design system
- Light/Dark mode với 5 color themes
- Responsive design
- Accessibility compliant

## 🚀 Quick Start

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL (hoặc Docker)
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone https://github.com/yourusername/primeacc.git
cd primeacc

# Cài đặt dependencies cho cả backend và frontend
npm install
npm run install:all
```

### Cấu hình

```bash
# Backend - tạo file .env
cd backend
cp env.example .env
# Chỉnh sửa .env với thông tin database và Sepay
```

### Chạy ứng dụng

**Cách 1: Docker chỉ Database + Local Backend/Frontend (Khuyến nghị cho Windows)**
```bash
# Start database và redis
docker-compose -f docker-compose.db.yml up -d

# Chạy backend và frontend local
npm run dev
```

**Cách 2: Docker Full Stack**
```bash
docker-compose up
```

**Cách 3: Chạy riêng lẻ**
```bash
# Start database trước
docker-compose -f docker-compose.db.yml up -d

# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Cách 4: Windows batch file**
```bash
start-all.bat
```

### URLs
- Frontend: http://localhost:3003
- Backend API: http://localhost:3000
- Prisma Studio: http://localhost:5555

## 📚 Tài liệu

**🚀 Deploy lên AWS:** [AWS_DEPLOY.md](AWS_DEPLOY.md) - Hướng dẫn deploy đơn giản

### Hướng dẫn cơ bản
- [Docker Guide](docs/DOCKER_GUIDE.md) - Chạy với Docker
- [Deposit Flow](docs/DEPOSIT_FLOW.md) - Luồng nạp tiền chi tiết
- [Shop Feature](docs/SHOP_FEATURE.md) - Tính năng mua tài khoản

### Deployment
- [AWS Deployment](docs/AWS_DEPLOYMENT.md) - Deploy lên AWS EC2/ECS (chi tiết)
- [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md) - Checklist đầy đủ

### Cấu hình Sepay
- [Sepay Setup](docs/SEPAY_SETUP.md) - Hướng dẫn cấu hình Sepay
- [Ngrok Setup](docs/NGROK_SETUP.md) - Test webhook với Ngrok

### Design System
- [Design System](docs/DESIGN_SYSTEM.md) - Hệ thống thiết kế
- [Theme System](docs/THEME_SYSTEM.md) - Hệ thống theme

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Queue**: Bull (Redis-based)
- **Auth**: JWT + Passport
- **Payment**: Sepay webhook integration

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Glassmorphism
- **Icons**: Lucide React
- **State**: React Context API
- **Forms**: React Hook Form
- **HTTP**: Axios

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (optional)
- **Deployment**: AWS EC2, Lightsail, hoặc VPS

## 📁 Cấu trúc dự án

```
primeacc/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── payment/     # Deposit & Sepay webhook
│   │   ├── shop/        # Account shop
│   │   ├── smm/         # SMM services
│   │   ├── user/        # User management
│   │   └── telegram/    # Telegram bot (optional)
│   ├── prisma/          # Database schema & migrations
│   └── package.json
├── frontend/            # Next.js App
│   ├── src/
│   │   ├── app/         # Pages (App Router)
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   └── lib/         # Utilities & API client
│   └── package.json
├── docs/                # Documentation
├── design-system/       # Design system files
└── docker-compose.yml   # Docker configuration
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/primeacc"

# JWT
JWT_SECRET="your-secret-key-min-32-chars"

# Sepay
SEPAY_API_KEY="sp_live_xxx"
SEPAY_WEBHOOK_SECRET="your-webhook-secret"

# Bank Info
BANK_ACCOUNT_NUMBER="106876543210"
BANK_ACCOUNT_NAME="YOUR NAME"
BANK_CODE="ICB"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## 📦 Database Management

### Prisma Migrations

**Sau khi cập nhật schema trong `backend/prisma/schema.prisma`, BẮT BUỘC chạy:**

```bash
# Từ root folder
npm run prisma:migrate
```

Lệnh này sẽ:
- Tạo migration file từ thay đổi schema
- Apply migration vào database
- Tự động regenerate Prisma Client

**Các lệnh khác:**

```bash
# Chỉ regenerate Prisma Client (không tạo migration)
npm run prisma:generate

# Seed dữ liệu mẫu
npm run prisma:seed
```

## 🚢 Deployment

### Deploy lên AWS

```bash
# 1. SSH vào EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# 3. Clone & configure
git clone <repo-url>
cd primeacc
cp .env.production.example .env.production
nano .env.production  # Điền thông tin

# 4. Deploy
chmod +x deploy.sh
./deploy.sh

# 5. Lấy IP và config webhook Sepay
curl ifconfig.me
```

Xem chi tiết: [AWS_DEPLOY.md](AWS_DEPLOY.md)

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

- Email: support@primeacc.com
- Telegram: @primeacc_support
- Documentation: [docs/](docs/)

## 🎯 Roadmap

### Đã hoàn thành
- ✅ Authentication & Authorization
- ✅ Deposit với Sepay webhook
- ✅ Shop tài khoản premium
- ✅ SMM services catalog
- ✅ Partnership program
- ✅ API documentation
- ✅ Theme system (5 colors + light/dark)
- ✅ Responsive design

### Đang phát triển
- 🔄 Telegram bot integration
- 🔄 Email notifications
- 🔄 Admin dashboard
- 🔄 Analytics & reporting

### Kế hoạch
- 📋 Rating & review system
- 📋 Wishlist feature
- 📋 Discount codes
- 📋 Multi-language support
- 📋 Mobile app (React Native)

---

**Made with ❤️ by PrimeAcc Team**
