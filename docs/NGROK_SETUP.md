# Setup Ngrok cho Test Local

## Bước 1: Cài đặt Ngrok

### Windows
```powershell
# Cách 1: Download từ website
# Truy cập: https://ngrok.com/download
# Download ngrok.exe và giải nén

# Cách 2: Dùng Chocolatey
choco install ngrok

# Cách 3: Dùng Scoop
scoop install ngrok
```

### Hoặc dùng npm (cross-platform)
```bash
npm install -g ngrok
```

## Bước 2: Đăng ký tài khoản Ngrok (Free)

1. Truy cập: https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản (free)
3. Copy authtoken từ dashboard

## Bước 3: Kích hoạt authtoken

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Bước 4: Chạy Backend

```bash
cd backend
npm run start:dev
# Backend chạy ở http://localhost:3001
```

## Bước 5: Tạo Public URL

Mở terminal mới:

```bash
ngrok http 3001
```

Output:
```
ngrok                                                                    

Session Status                online
Account                       your-email@gmail.com (Plan: Free)
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## Bước 6: Copy URL cho Sepay

Từ output trên, copy URL:
```
https://abc123def456.ngrok-free.app
```

Webhook URL đầy đủ:
```
https://abc123def456.ngrok-free.app/payment/sepay/webhook
```

## Bước 7: Cấu hình Sepay

Vào Sepay Dashboard → Webhook:

```
Gọi đến URL: https://abc123def456.ngrok-free.app/payment/sepay/webhook
Kiểu chứng thực: API Key
API Key: 382452828b18ddc6a644fd9b0c1e48e51cf2b6db30f73e186b7fd262367cb369
Request Content type: application/json
```

## Bước 8: Test Webhook

### Test từ Sepay Dashboard
1. Click nút "Test" trong Sepay
2. Kiểm tra logs backend
3. Phải thấy request đến

### Test thủ công
```bash
curl -X POST "https://abc123def456.ngrok-free.app/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Apikey API_KEY_CUA_BAN_DAT" \
  -d '{
    "transaction_id": "TEST123",
    "amount": 10000,
    "content": "NAP ABC123XY",
    "account_number": "101877183706"
  }'
```

## Bước 9: Monitor Requests

Ngrok có web interface để xem requests:

```
http://127.0.0.1:4040
```

Mở browser và truy cập URL trên để xem:
- Tất cả requests đến
- Request/response details
- Replay requests

## Lưu ý quan trọng

### ⚠️ Ngrok Free Plan
- URL thay đổi mỗi khi restart ngrok
- Phải cập nhật lại URL trong Sepay mỗi lần
- Session timeout sau 2 giờ (phải restart)

### ✅ Ngrok Paid Plan (Optional)
- URL cố định (subdomain tùy chỉnh)
- Không timeout
- Nhiều connections đồng thời

```bash
# Với paid plan, dùng custom subdomain
ngrok http 3001 --subdomain=primeacc-api
# URL: https://primeacc-api.ngrok.io
```

## Troubleshooting

### Ngrok không chạy?
```bash
# Kiểm tra port 3001 đang chạy
netstat -ano | findstr :3001

# Kiểm tra ngrok version
ngrok version

# Kiểm tra authtoken
ngrok config check
```

### Webhook không nhận được?
1. Kiểm tra ngrok đang chạy: `http://127.0.0.1:4040`
2. Kiểm tra backend logs
3. Test trực tiếp bằng curl
4. Kiểm tra firewall không block

### URL thay đổi liên tục?
- Upgrade lên Ngrok paid plan
- Hoặc deploy lên server thật (Heroku, Railway, VPS)

## Alternative: Deploy lên Server

Thay vì dùng ngrok, bạn có thể deploy lên:

### Railway (Free tier)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Heroku (Free tier)
```bash
# Install Heroku CLI
# Deploy
heroku create primeacc-api
git push heroku main
```

### VPS (DigitalOcean, Vultr, etc.)
- Setup domain: api.primeacc.com
- SSL certificate (Let's Encrypt)
- Nginx reverse proxy
- PM2 process manager

---

**Tóm tắt:**
1. Cài ngrok: `npm install -g ngrok`
2. Chạy: `ngrok http 3001`
3. Copy URL: `https://abc123.ngrok-free.app`
4. Điền vào Sepay: `https://abc123.ngrok-free.app/payment/sepay/webhook`
5. Test!
