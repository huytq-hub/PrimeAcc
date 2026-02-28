# 🚀 Deploy PrimeAcc lên AWS

## Bước 1: Tạo EC2 Instance

1. Vào AWS Console → EC2 → Launch Instance
2. Chọn: **Ubuntu Server 22.04 LTS**
3. Instance type: **t3.small** (hoặc t3.micro để tiết kiệm)
4. Storage: **30GB**
5. Security Group - Mở các ports:
   - SSH: 22
   - HTTP: 80
   - Custom TCP: 3000 (Frontend)
   - Custom TCP: 3001 (Backend)

## Bước 2: Kết nối SSH

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

## Bước 3: Cài đặt Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout và login lại để apply docker group
exit
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

## Bước 4: Clone và Configure

```bash
# Clone repository
git clone https://github.com/yourusername/primeacc.git
cd primeacc

# Tạo file .env.production
cp .env.production.example .env.production
nano .env.production
```

**Điền các thông tin sau vào .env.production:**

```env
# Database
POSTGRES_PASSWORD=your_strong_password_here
REDIS_PASSWORD=your_redis_password_here

# Backend
JWT_SECRET=your_random_32_chars_secret_key
CORS_ORIGINS=http://YOUR_EC2_IP:3000

# Frontend
NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:3001
NEXT_PUBLIC_ALLOW_MEMBER_PARTNERSHIP=true

# Sepay
SEPAY_API_KEY=sp_live_your_sepay_api_key
SEPAY_WEBHOOK_SECRET=your_webhook_secret

# Bank
BANK_ACCOUNT_NUMBER=101877183706
BANK_ACCOUNT_NAME=YOUR NAME
```

## Bước 5: Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

## Bước 6: Lấy IP và Config Webhook

```bash
# Lấy IP của server
curl ifconfig.me
```

**Vào Sepay Dashboard → Webhook:**
- URL: `http://YOUR_EC2_IP:3001/payment/sepay/webhook`
- API Key: (giá trị SEPAY_WEBHOOK_SECRET từ .env.production)

## Bước 7: Test

Truy cập:
- Frontend: `http://YOUR_EC2_IP:3000`
- Backend: `http://YOUR_EC2_IP:3001`

Test webhook:
```bash
curl -X POST "http://YOUR_EC2_IP:3001/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Apikey YOUR_WEBHOOK_SECRET" \
  -d '{"transaction_id":"TEST1","amount":10000,"content":"NAP ABC123"}'
```

---

## 🔧 Các lệnh hữu ích

```bash
# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Xem logs backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Update code
git pull
./deploy.sh
```

---

## 💰 Chi phí ước tính

- EC2 t3.small: ~$15/tháng
- EC2 t3.micro: ~$8/tháng (free tier 12 tháng đầu)
- Storage 30GB: ~$3/tháng

---

## 🐛 Troubleshooting

**Container không start:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

**Database lỗi:**
```bash
docker-compose -f docker-compose.prod.yml ps
docker exec -it primeacc_postgres psql -U postgres -d primeacc
```

**Webhook không hoạt động:**
- Kiểm tra Security Group đã mở port 3001
- Kiểm tra SEPAY_WEBHOOK_SECRET đúng chưa
- Xem logs: `docker-compose -f docker-compose.prod.yml logs backend | grep sepay`

---

**Done! 🎉**
