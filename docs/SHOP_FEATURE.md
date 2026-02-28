# Tính năng Mua Tài Khoản (Shop)

## Tổng quan

Tính năng mua tài khoản cho phép người dùng mua các tài khoản premium (Netflix, Spotify, Canva, ChatGPT, v.v.) với giao hàng tự động 24/7.

## Kiến trúc

### Backend (NestJS + Prisma)

#### Database Schema

```prisma
model AccountCategory {
  id        String           @id @default(cuid())
  name      String
  products  AccountProduct[]
}

model AccountProduct {
  id           String           @id @default(cuid())
  name         String
  description  String?
  price        Decimal          @db.Decimal(20, 2)
  categoryId   String
  category     AccountCategory  @relation(fields: [categoryId], references: [id])
  stocks       AccountStock[]
  purchases    AccountPurchase[]
}

model AccountStock {
  id           String          @id @default(cuid())
  productId    String
  product      AccountProduct  @relation(fields: [productId], references: [id])
  content      String          // email|pass or key
  isSold       Boolean         @default(false)
  lockedAt     DateTime?       // Lock Stock logic
  soldAt       DateTime?
  purchaseId   String?         @unique
  purchase     AccountPurchase? @relation(fields: [purchaseId], references: [id])
}

model AccountPurchase {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id])
  productId   String
  product     AccountProduct @relation(fields: [productId], references: [id])
  stock       AccountStock?
  price       Decimal        @db.Decimal(20, 2)
  createdAt   DateTime       @default(now())
}
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/shop/products` | No | Lấy danh sách sản phẩm với số lượng tồn kho |
| GET | `/shop/categories` | No | Lấy danh sách danh mục |
| POST | `/shop/buy` | Yes | Mua tài khoản (trả về thông tin tài khoản) |
| GET | `/shop/purchases` | Yes | Lấy lịch sử mua hàng của user |

#### Lock Stock Logic

Để tránh race condition khi nhiều người mua cùng lúc:

1. Tìm stock chưa bán (`isSold = false`)
2. Kiểm tra stock chưa bị lock hoặc lock đã hết hạn (> 5 phút)
3. Lock stock bằng cách set `lockedAt = now()`
4. Kiểm tra số dư user
5. Trừ tiền user
6. Tạo purchase record
7. Đánh dấu stock đã bán (`isSold = true`, `soldAt = now()`)
8. Ghi log transaction

### Frontend (Next.js + TypeScript)

#### Pages

1. **Shop Page** (`/dashboard/shop`)
   - Hiển thị danh sách sản phẩm với filter và search
   - Click vào sản phẩm để mở modal mua hàng
   - Hiển thị số dư hiện tại

2. **Orders Page** (`/dashboard/orders`)
   - Hiển thị lịch sử mua hàng
   - Xem lại thông tin tài khoản đã mua
   - Copy thông tin tài khoản

#### Components

1. **BuyModal** (`/components/shop/BuyModal.tsx`)
   - Modal xác nhận mua hàng
   - Kiểm tra số dư
   - Hiển thị thông tin tài khoản sau khi mua thành công
   - Copy to clipboard

#### API Client

```typescript
// /lib/api/shop.ts
export const shopApi = {
  getProducts: () => Promise<Product[]>
  getCategories: () => Promise<Category[]>
  buyAccount: (productId: string) => Promise<BuyAccountResponse>
  getPurchases: () => Promise<Purchase[]>
}
```

## Cài đặt và Chạy

### 1. Seed Database

Tạo dữ liệu mẫu (categories, products, stocks):

```bash
cd backend
npm run prisma:seed
```

### 2. Chạy Backend

```bash
cd backend
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3001`

### 3. Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## Luồng sử dụng

### 1. Người dùng xem sản phẩm

- Truy cập `/dashboard/shop`
- Xem danh sách sản phẩm với giá, mô tả, số lượng tồn kho
- Filter theo danh mục
- Search theo tên sản phẩm

### 2. Người dùng mua sản phẩm

- Click vào sản phẩm hoặc nút "Mua ngay"
- Modal hiển thị thông tin sản phẩm và số dư hiện tại
- Kiểm tra số dư có đủ không
- Click "Xác nhận mua"
- Hệ thống xử lý:
  - Lock stock
  - Kiểm tra số dư
  - Trừ tiền
  - Tạo purchase
  - Đánh dấu stock đã bán
  - Ghi log transaction
- Modal hiển thị thông tin tài khoản đã mua
- User có thể copy thông tin

### 3. Người dùng xem lại đơn hàng

- Truy cập `/dashboard/orders`
- Xem lịch sử mua hàng
- Xem lại thông tin tài khoản
- Copy thông tin nếu cần

## Xử lý lỗi

### Backend

- **Product not found**: Sản phẩm không tồn tại
- **Out of stock**: Hết hàng
- **Insufficient balance**: Số dư không đủ
- **User not found**: User không tồn tại

### Frontend

- Hiển thị thông báo lỗi trong modal
- Disable nút "Mua ngay" nếu hết hàng
- Hiển thị cảnh báo nếu số dư không đủ
- Gợi ý nạp thêm tiền

## Bảo mật

1. **Authentication**: Tất cả API mua hàng và xem đơn hàng yêu cầu JWT token
2. **Transaction**: Sử dụng Prisma transaction để đảm bảo tính toàn vẹn dữ liệu
3. **Lock Stock**: Tránh race condition khi nhiều người mua cùng lúc
4. **Validation**: Kiểm tra số dư, stock availability trước khi xử lý

## Design System

Tính năng này tuân theo PrimeAcc Design System:

- **Style**: Glassmorphism với backdrop blur
- **Colors**: Primary (#E11D48), CTA (#2563EB)
- **Typography**: Poppins (headings), Open Sans (body)
- **Components**: Glass cards, gradient buttons, smooth transitions
- **Icons**: Lucide React (ShoppingBag, Star, ShieldCheck, Zap, Copy, etc.)
- **Accessibility**: Focus states, keyboard navigation, contrast ratios

## Tính năng nâng cao (TODO)

- [ ] Rating và review sản phẩm
- [ ] Wishlist
- [ ] Discount codes
- [ ] Bulk purchase
- [ ] Auto-refill stock
- [ ] Email notification sau khi mua
- [ ] Warranty tracking
- [ ] Product recommendations
- [ ] Purchase analytics

## Testing

### Manual Testing

1. Tạo user và nạp tiền
2. Truy cập shop và xem sản phẩm
3. Mua sản phẩm với số dư đủ
4. Mua sản phẩm với số dư không đủ (test error)
5. Mua sản phẩm hết hàng (test error)
6. Xem lại đơn hàng
7. Copy thông tin tài khoản

### API Testing

```bash
# Get products
curl http://localhost:3001/shop/products

# Get categories
curl http://localhost:3001/shop/categories

# Buy account (requires auth)
curl -X POST http://localhost:3001/shop/buy \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "netflix-1m"}'

# Get purchases (requires auth)
curl http://localhost:3001/shop/purchases \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Lỗi "Out of stock" ngay cả khi có stock

- Kiểm tra `lockedAt` trong database
- Stock có thể bị lock quá lâu (> 5 phút)
- Chạy query để unlock: `UPDATE AccountStock SET lockedAt = NULL WHERE lockedAt < NOW() - INTERVAL '5 minutes'`

### Lỗi "Insufficient balance"

- Kiểm tra số dư user trong database
- Nạp thêm tiền qua trang Deposit

### Frontend không load sản phẩm

- Kiểm tra backend đang chạy
- Kiểm tra CORS settings
- Kiểm tra console log trong browser

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub.
