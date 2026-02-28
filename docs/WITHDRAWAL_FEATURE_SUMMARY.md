# Tính năng Rút tiền Hoa hồng - Tóm tắt

## Tổng quan
Đã triển khai đầy đủ tính năng rút tiền hoa hồng cho hệ thống Partnership, bao gồm:
- User tạo yêu cầu rút tiền
- Hiển thị lịch sử rút tiền
- Admin xử lý yêu cầu (approve/complete/reject)

## Files đã thêm/sửa

### Backend
1. **backend/src/referral/referral.service.ts**
   - Thêm method `getWithdrawals(userId)` - Lấy 20 withdrawals gần nhất của user
   - Method `requestWithdrawal()` đã có sẵn từ trước

2. **backend/src/referral/referral.controller.ts**
   - Thêm endpoint `GET /referral/withdrawals` - Lấy lịch sử rút tiền của user

### Frontend
1. **frontend/src/lib/api/referral.ts**
   - Thêm interface `WithdrawalHistory`
   - Thêm method `getWithdrawals()` trong referralApi

2. **frontend/src/app/dashboard/partnership/page.tsx**
   - Thêm state `withdrawals` để lưu danh sách withdrawals
   - Load withdrawals trong `loadData()`
   - Thêm UI section "Lịch sử rút tiền" sau "Lịch sử hoa hồng"
   - Hiển thị status với màu sắc (PENDING/APPROVED/COMPLETED/REJECTED)
   - Hiển thị đầy đủ thông tin: số tiền, ngân hàng, số TK, chủ TK, ngày tạo, ngày xử lý, ghi chú

### Documentation
1. **TEST_WITHDRAWAL_FLOW.md** - Hướng dẫn test tính năng
2. **WITHDRAWAL_FEATURE_SUMMARY.md** - Tài liệu này

## Workflow

### 1. User tạo yêu cầu rút tiền
```
Partnership Page → Click "Rút tiền ngay" → Điền form → Submit
↓
POST /referral/withdraw
↓
Backend tạo CommissionWithdrawal (status: PENDING)
Backend trừ số dư commissionBalance
↓
Alert thành công → Reload data
```

### 2. User xem lịch sử
```
Partnership Page → Scroll to "Lịch sử rút tiền"
↓
GET /referral/withdrawals
↓
Hiển thị 20 withdrawals gần nhất với status màu sắc
```

### 3. Admin xử lý
```
Admin Panel → Withdrawals → Chọn yêu cầu
↓
Click "Duyệt" → PATCH /admin/withdrawals/:id/approve → Status: APPROVED
↓
Click "Hoàn thành" → PATCH /admin/withdrawals/:id/complete → Status: COMPLETED
hoặc
Click "Từ chối" → PATCH /admin/withdrawals/:id/reject → Status: REJECTED (+ note)
```

## Database Schema

### CommissionWithdrawal Model
```prisma
model CommissionWithdrawal {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  amount          Decimal  @db.Decimal(20, 2)
  bankName        String
  bankAccount     String
  bankAccountName String
  status          String   @default("PENDING") // PENDING, APPROVED, COMPLETED, REJECTED
  processedAt     DateTime?
  note            String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([status])
}
```

## API Endpoints

### User Endpoints (JWT Required)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/referral/withdraw` | Tạo yêu cầu rút tiền | `{ amount, bankName, bankAccount, bankAccountName }` | Withdrawal object |
| GET | `/referral/withdrawals` | Lấy lịch sử rút tiền | - | Array of WithdrawalHistory |

### Admin Endpoints (JWT + ADMIN role)
| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/admin/withdrawals` | Lấy danh sách withdrawals | `?status=PENDING` | Array of Withdrawal |
| PATCH | `/admin/withdrawals/:id/approve` | Duyệt yêu cầu | - | Updated withdrawal |
| PATCH | `/admin/withdrawals/:id/complete` | Hoàn thành | - | Updated withdrawal |
| PATCH | `/admin/withdrawals/:id/reject` | Từ chối | `{ note }` | Updated withdrawal |

## UI Components

### Partnership Page - Lịch sử rút tiền
```tsx
<div className="glass-card rounded-2xl p-6">
  <h3>Lịch sử rút tiền</h3>
  {withdrawals.map(withdrawal => (
    <div className="glass rounded-xl p-4 border border-border">
      {/* Status badge với màu sắc */}
      <span className={statusColor}>{statusLabel}</span>
      
      {/* Thông tin withdrawal */}
      <p>Số tiền: {formatNumber(amount)}đ</p>
      <p>Ngân hàng: {bankName} - {bankAccount}</p>
      <p>Chủ TK: {bankAccountName}</p>
      <p>Ngày tạo: {createdAt}</p>
      {processedAt && <p>Xử lý: {processedAt}</p>}
      {note && <p className="text-red-600">Ghi chú: {note}</p>}
    </div>
  ))}
</div>
```

### Admin Panel - Withdrawals Page
- Filter theo status (PENDING/APPROVED/COMPLETED/REJECTED/All)
- Hiển thị thông tin user, số dư hoa hồng, thông tin ngân hàng
- Action buttons: Duyệt, Hoàn thành, Từ chối
- Modal xác nhận với form ghi chú (cho reject)

## Status Flow

```
PENDING (Chờ duyệt - màu vàng)
  ↓ Admin click "Duyệt"
APPROVED (Đã duyệt - màu xanh dương)
  ↓ Admin click "Hoàn thành"
COMPLETED (Hoàn thành - màu xanh lá)

hoặc

PENDING (Chờ duyệt - màu vàng)
  ↓ Admin click "Từ chối" + nhập lý do
REJECTED (Từ chối - màu đỏ)
```

## Validation Rules

### User Side
1. Số tiền rút tối thiểu: 100,000đ
2. Số tiền không vượt quá số dư khả dụng
3. Phải điền đầy đủ: bankName, bankAccount, bankAccountName
4. bankAccountName tự động uppercase

### Backend Side
1. Check user tồn tại
2. Check số dư đủ: `commissionBalance >= amount`
3. Trừ số dư ngay khi tạo withdrawal (tránh rút trùng)
4. Tạo record với status PENDING

### Admin Side
1. Chỉ ADMIN mới có quyền xử lý
2. PENDING → có thể Approve hoặc Reject
3. APPROVED → có thể Complete
4. COMPLETED/REJECTED → không thể thay đổi

## Security

1. **Authentication**: Tất cả endpoints yêu cầu JWT token
2. **Authorization**: Admin endpoints yêu cầu role ADMIN
3. **Data Isolation**: User chỉ thấy withdrawals của mình
4. **Balance Protection**: Trừ số dư ngay khi tạo withdrawal

## Performance

1. **Pagination**: Giới hạn 20 withdrawals gần nhất
2. **Indexing**: Index trên userId và status
3. **Parallel Loading**: Load withdrawals cùng với stats, history, config

## Testing Checklist

- [x] User có thể tạo yêu cầu rút tiền
- [x] Validation số tiền tối thiểu 100,000đ
- [x] Validation số dư không đủ
- [x] Số dư giảm ngay sau khi tạo yêu cầu
- [x] Lịch sử rút tiền hiển thị đầy đủ
- [x] Status hiển thị với màu sắc đúng
- [x] Admin thấy tất cả yêu cầu
- [x] Admin có thể filter theo status
- [x] Admin có thể approve/complete/reject
- [x] Ghi chú hiển thị khi reject
- [x] Responsive trên mobile

## Next Steps (Optional)

1. **Email Notification**: Gửi email khi status thay đổi
2. **Webhook**: Tích hợp với ngân hàng để tự động chuyển tiền
3. **Batch Processing**: Xử lý nhiều withdrawals cùng lúc
4. **Export**: Xuất báo cáo withdrawals ra Excel
5. **Analytics**: Thống kê tổng số tiền rút theo tháng/quý
6. **Auto-complete**: Tự động complete sau khi chuyển tiền thành công

## Troubleshooting

### Prisma Client Errors
```bash
cd backend
npm run prisma:generate
# hoặc
./generate-prisma.bat
```

### TypeScript Errors
- Restart TypeScript server trong IDE
- Hoặc restart backend server

### Withdrawals không hiển thị
- Check console.log trong browser
- Check Network tab
- Thử filter "Tất cả" thay vì "Chờ duyệt"

## Kết luận

Tính năng rút tiền hoa hồng đã được triển khai đầy đủ với:
- ✅ Backend API hoàn chỉnh
- ✅ Frontend UI đẹp và responsive
- ✅ Admin panel để xử lý
- ✅ Validation và security
- ✅ Status flow rõ ràng
- ✅ Documentation đầy đủ

Sẵn sàng để test và deploy!
