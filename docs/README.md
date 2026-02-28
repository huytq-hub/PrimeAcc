# PrimeAcc Documentation

Tài liệu kỹ thuật đầy đủ cho dự án PrimeAcc.

## 📚 Mục lục

### 🚀 Getting Started
- [Docker Guide](DOCKER_GUIDE.md) - Hướng dẫn chạy với Docker
- [Deposit Flow](DEPOSIT_FLOW.md) - Luồng nạp tiền chi tiết với diagram

### 🎨 Design & UI
- [Design System](DESIGN_SYSTEM.md) - Hệ thống thiết kế Glassmorphism
- [Theme System](THEME_SYSTEM.md) - Hệ thống theme với 5 màu + light/dark mode

### 💰 Features
- [Shop Feature](SHOP_FEATURE.md) - Tính năng mua tài khoản premium
- [Sepay Setup](SEPAY_SETUP.md) - Cấu hình thanh toán Sepay

### 🚢 Deployment
- [AWS Deployment](AWS_DEPLOYMENT.md) - Deploy lên AWS EC2/ECS/Lightsail
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Checklist đầy đủ cho production

### 🔧 Development Tools
- [Ngrok Setup](NGROK_SETUP.md) - Test webhook với Ngrok local

## 📖 Hướng dẫn sử dụng

### Cho Developer mới

1. Đọc [Docker Guide](DOCKER_GUIDE.md) để setup môi trường development
2. Xem [Design System](DESIGN_SYSTEM.md) để hiểu cách thiết kế UI
3. Đọc [Shop Feature](SHOP_FEATURE.md) để hiểu luồng mua hàng
4. Xem [Deposit Flow](DEPOSIT_FLOW.md) để hiểu luồng nạp tiền

### Cho DevOps/Deployment

1. Đọc [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) trước khi deploy
2. Chọn phương thức deploy từ [AWS Deployment](AWS_DEPLOYMENT.md)
3. Cấu hình Sepay theo [Sepay Setup](SEPAY_SETUP.md)
4. Test webhook với [Ngrok Setup](NGROK_SETUP.md) trước khi production

### Cho Designer/Frontend

1. Xem [Design System](DESIGN_SYSTEM.md) cho color palette, typography, components
2. Đọc [Theme System](THEME_SYSTEM.md) để hiểu cách implement themes
3. Follow pre-delivery checklist trong Design System

## 🔗 Quick Links

### API Documentation
- Backend API: `http://localhost:3000/api` (Swagger)
- Frontend: `http://localhost:3003`

### Database
- Prisma Studio: `http://localhost:5555`
- PostgreSQL: `localhost:5432`

### Monitoring
- Ngrok Dashboard: `http://127.0.0.1:4040`
- Docker Stats: `docker stats`

## 📝 Cấu trúc tài liệu

```
docs/
├── README.md                    # File này
├── DOCKER_GUIDE.md             # Setup Docker
├── DEPOSIT_FLOW.md             # Luồng nạp tiền
├── DESIGN_SYSTEM.md            # Design system
├── THEME_SYSTEM.md             # Theme system
├── SHOP_FEATURE.md             # Tính năng shop
├── SEPAY_SETUP.md              # Cấu hình Sepay
├── AWS_DEPLOYMENT.md           # Deploy AWS
├── DEPLOYMENT_CHECKLIST.md     # Checklist deploy
└── NGROK_SETUP.md              # Setup Ngrok
```

## 🆘 Troubleshooting

### Vấn đề thường gặp

**Docker không chạy?**
→ Xem [Docker Guide - Troubleshooting](DOCKER_GUIDE.md#troubleshooting)

**Webhook không hoạt động?**
→ Xem [Sepay Setup - Troubleshooting](SEPAY_SETUP.md#troubleshooting)

**Deployment lỗi?**
→ Xem [Deployment Checklist](DEPLOYMENT_CHECKLIST.md#troubleshooting)

**UI không đúng design?**
→ Xem [Design System - Pre-Delivery Checklist](DESIGN_SYSTEM.md#pre-delivery-checklist)

## 📞 Support

- GitHub Issues: [Create Issue](https://github.com/yourusername/primeacc/issues)
- Email: support@primeacc.com
- Telegram: @primeacc_support

## 🔄 Cập nhật tài liệu

Tài liệu được cập nhật thường xuyên. Kiểm tra git log để xem thay đổi:

```bash
git log --oneline docs/
```

---

**Last Updated:** 2024-02-28
