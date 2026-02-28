# Hướng dẫn cấu hình Sepay

## Bước 1: Cấu hình Backend

### 1.1. Tạo Webhook Secret

Tạo một chuỗi secret ngẫu nhiên để verify webhook:

```bash
# Tạo secret key ngẫu nhiên (chọn 1 trong các cách sau)

# Cách 1: Dùng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Cách 2: Dùng OpenSSL
openssl rand -hex 32

# Cách 3: Tự tạo (ít nhất 32 ký tự)
# Ví dụ: my-super-secret-webhook-key-2024-primeacc-xyz123
```

### 1.2. Cập nhật file `.env`

Mở `backend/.env` và điền:

```env
# Sepay Configuration
SEPAY_API_KEY="your_sepay_api_key_here"
SEPAY_WEBHOOK_SECRET="your_generated_secret_here"

# Ví dụ:
# SEPAY_API_KEY="sp_live_abc123xyz456"
# SEPAY_WEBHOOK_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### 1.3. Xác định Webhook URL

Webhook URL của bạn sẽ là:

```
https://yourdomain.com/payment/sepay/webhook
```

**Ví dụ:**
- Production: `https://api.primeacc.com/payment/sepay/webhook`
- Staging: `https://staging-api.primeacc.com/payment/sepay/webhook`
- Local (với ngrok): `https://abc123.ngrok.io/payment/sepay/webhook`

## Bước 2: Test Local với Ngrok (Optional)

Nếu muốn test trên local trước khi deploy:

### 2.1. Cài đặt Ngrok

```bash
# Download từ https://ngrok.com/download
# Hoặc dùng npm
npm install -g ngrok
```

### 2.2. Chạy Backend

```bash
cd backend
npm run start:dev
# Backend chạy ở http://localhost:3001
```

### 2.3. Tạo Public URL

```bash
ngrok http 3001
```

Output:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

Webhook URL của bạn: `https://abc123.ngrok.io/payment/sepay/webhook`

## Bước 3: Cấu hình trên Sepay Dashboard

### 3.1. Đăng nhập Sepay

1. Truy cập https://my.sepay.vn
2. Đăng nhập tài khoản
3. Vào menu **Cài đặt** → **Webhook**

### 3.2. Thêm Webhook Endpoint

Điền thông tin:

```
Webhook URL: https://yourdomain.com/payment/sepay/webhook
Method: POST
Events: ✓ Giao dịch thành công (transaction.success)
Secret Key: <paste_your_SEPAY_WEBHOOK_SECRET_here>
Status: ✓ Kích hoạt
```

**Lưu ý:** Secret Key phải giống với `SEPAY_WEBHOOK_SECRET` trong file `.env`

### 3.3. Test Webhook

Sepay có nút "Test Webhook" để gửi thử:

1. Click **Test Webhook**
2. Kiểm tra logs backend xem có nhận được không
3. Response phải là `200 OK`

## Bước 4: Kích hoạt Signature Verification

Sau khi test thành công, uncomment code verify signature:

Mở `backend/src/payment/payment.service.ts`:

```typescript
async handleSepayWebhook(payload: any, signature: string) {
  // Uncomment phần này:
  const expectedSecret = this.configService.get('SEPAY_WEBHOOK_SECRET');
  if (signature !== expectedSecret) {
    throw new ForbiddenException('Invalid signature');
  }
  
  // ... rest of code
}
```

## Bước 5: Test End-to-End

### 5.1. Tạo giao dịch test

1. Vào `/dashboard/deposit`
2. Nhập số tiền: 10,000đ
3. Click "Tạo mã QR"
4. Copy nội dung chuyển khoản: `NAP ABC123XY`

### 5.2. Chuyển khoản thử

**Cách 1: Chuyển khoản thật (khuyến nghị)**
- Mở app ngân hàng
- Chuyển 10,000đ với nội dung `NAP ABC123XY`
- Đợi 1-3 phút

**Cách 2: Dùng Sepay Test Mode**
- Vào Sepay Dashboard → Test
- Tạo giao dịch test với nội dung `NAP ABC123XY`

### 5.3. Kiểm tra kết quả

1. Kiểm tra logs backend:
```bash
docker logs -f primeacc-backend
# Hoặc
npm run start:dev
```

2. Kiểm tra database:
```sql
SELECT * FROM "Deposit" ORDER BY "createdAt" DESC LIMIT 5;
SELECT * FROM "Transaction" ORDER BY "createdAt" DESC LIMIT 5;
SELECT id, username, balance FROM "User" WHERE id = 'your_user_id';
```

3. Refresh trang `/dashboard/deposit` → Balance phải cập nhật

## Troubleshooting

### Webhook không được gọi?

**Kiểm tra:**
1. ✅ Webhook URL đúng format: `https://domain.com/payment/sepay/webhook`
2. ✅ Backend đang chạy và accessible từ internet
3. ✅ Firewall không block request từ Sepay
4. ✅ SSL certificate hợp lệ (nếu dùng HTTPS)

**Test webhook thủ công:**
```bash
curl -X POST "https://yourdomain.com/payment/sepay/webhook" \
  -H "Content-Type: application/json" \
  -H "x-signature: your_webhook_secret" \
  -d '{
    "transaction_id": "TEST123",
    "amount": 10000,
    "content": "NAP ABC123XY",
    "account_number": "106876543210"
  }'
```

### Webhook trả về 403 Forbidden?

**Nguyên nhân:** Signature không khớp

**Giải pháp:**
1. Kiểm tra `SEPAY_WEBHOOK_SECRET` trong `.env`
2. Kiểm tra Secret Key trên Sepay Dashboard
3. Đảm bảo 2 giá trị giống hệt nhau
4. Restart backend sau khi thay đổi `.env`

### Balance không cập nhật?

**Kiểm tra:**
1. Nội dung chuyển khoản đúng format: `NAP XXXXXXXX`
2. UserId có tồn tại trong database
3. Transaction ID chưa được xử lý trước đó
4. Logs backend có error gì không

**Debug:**
```bash
# Xem logs chi tiết
docker logs primeacc-backend | grep -i "sepay\|webhook\|deposit"

# Kiểm tra user
psql -U postgres -d primeacc -c "SELECT id, username, balance FROM \"User\" LIMIT 5;"

# Kiểm tra deposits
psql -U postgres -d primeacc -c "SELECT * FROM \"Deposit\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

## Security Best Practices

### Production Checklist

- [ ] Dùng HTTPS cho webhook URL
- [ ] Enable signature verification (uncomment code)
- [ ] Dùng secret key mạnh (>32 ký tự)
- [ ] Không commit `.env` vào git
- [ ] Rotate secret key định kỳ (3-6 tháng)
- [ ] Monitor webhook logs
- [ ] Set up alerts cho failed webhooks
- [ ] Rate limit webhook endpoint
- [ ] IP whitelist (nếu Sepay cung cấp IP list)

### Environment Variables

```env
# Development
SEPAY_API_KEY="sp_test_xxx"
SEPAY_WEBHOOK_SECRET="dev-secret-key"

# Production
SEPAY_API_KEY="sp_live_xxx"
SEPAY_WEBHOOK_SECRET="prod-super-secret-key-xyz123"
```

## Sepay Webhook Payload Format

Sepay gửi webhook với format:

```json
{
  "transaction_id": "SEP123456789",
  "reference_number": "MB123456",
  "amount": 100000,
  "content": "NAP ABC123XY",
  "account_number": "106876543210",
  "bank_code": "ICB",
  "transaction_date": "2024-02-28 10:00:00",
  "status": "success"
}
```

Headers:
```
Content-Type: application/json
x-signature: <your_webhook_secret>
```

## Support

- Sepay Documentation: https://docs.sepay.vn
- Sepay Support: support@sepay.vn
- Sepay Hotline: 1900 xxxx

---

**Tóm tắt nhanh:**

1. Tạo secret key: `openssl rand -hex 32`
2. Điền vào `backend/.env`:
   ```env
   SEPAY_API_KEY="sp_live_xxx"
   SEPAY_WEBHOOK_SECRET="<your_secret>"
   ```
3. Webhook URL: `https://yourdomain.com/payment/sepay/webhook`
4. Cấu hình trên Sepay Dashboard
5. Test và uncomment signature verification
