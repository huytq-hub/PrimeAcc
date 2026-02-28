# Admin Panel - PrimeAcc

## Tổng quan

Admin Panel là giao diện quản trị toàn diện cho hệ thống PrimeAcc, được thiết kế theo **Data-Dense Dashboard** style với font Fira Code/Fira Sans.

## Design System

### Colors
- **Primary**: `#1E40AF` (Blue 800)
- **Secondary**: `#3B82F6` (Blue 500)
- **CTA**: `#F59E0B` (Amber 500)
- **Background**: `#F8FAFC` (Slate 50)
- **Text**: `#1E3A8A` (Blue 900)

### Typography
- **Headings**: Fira Code (monospace, technical)
- **Body**: Fira Sans (clean, readable)

### Key Features
- Data-dense layout với minimal padding
- Hover tooltips và smooth transitions
- Row highlighting on hover
- Responsive design (375px - 1440px)
- Accessibility compliant (WCAG AA)

## Tính năng

### 1. Dashboard Overview (`/admin`)
- **Thống kê tổng quan**:
  - Tổng người dùng
  - Tổng doanh thu
  - Tổng nạp tiền
  - Tổng đơn hàng
  - Doanh thu hôm nay
  - Đơn hàng hôm nay
  - Yêu cầu rút tiền chờ duyệt
- **Quick Actions**:
  - Quản lý người dùng
  - Quản lý sản phẩm
  - Xử lý yêu cầu rút tiền

### 2. User Management (`/admin/users`)
- **Danh sách người dùng**:
  - Tìm kiếm theo username/email
  - Filter theo role (MEMBER, AGENT, ADMIN)
  - Phân trang (20 users/page)
- **Thông tin hiển thị**:
  - Username, email
  - Role badge
  - Số dư tài khoản
  - Số dư hoa hồng
  - Commission tier
  - Số người giới thiệu
- **Thao tác**:
  - Điều chỉnh số dư (cộng/trừ tiền)
  - Thay đổi role
  - Ghi chú lý do điều chỉnh

### 3. Product Management (`/admin/products`)
- **Danh sách sản phẩm**:
  - Hiển thị dạng grid cards
  - Thông tin: tên, giá, category, tồn kho, đã bán
- **Quản lý stock**:
  - Thêm stock đơn lẻ
  - Thêm bulk stock (nhiều dòng)
  - Format: `email|password` hoặc `license_key`
- **Thao tác**:
  - Tạo sản phẩm mới
  - Sửa thông tin sản phẩm
  - Xóa sản phẩm (chỉ khi không còn stock)

### 4. Transaction Management (`/admin/transactions`)
- **Lịch sử giao dịch**:
  - Tất cả giao dịch trong hệ thống
  - Filter theo loại (DEPOSIT, ACCOUNT_PURCHASE, SMM_ORDER, REFUND)
  - Phân trang (50 transactions/page)
- **Thông tin hiển thị**:
  - Thời gian
  - Người dùng
  - Loại giao dịch với icon
  - Số tiền
  - Số dư cũ/mới
  - Mô tả

### 5. Withdrawal Management (`/admin/withdrawals`)
- **Yêu cầu rút tiền**:
  - Filter theo trạng thái (PENDING, APPROVED, COMPLETED, REJECTED)
  - Hiển thị thông tin chi tiết:
    - Người dùng
    - Số dư hoa hồng hiện tại
    - Thông tin ngân hàng
    - Số tiền rút
- **Workflow xử lý**:
  1. **PENDING** → Admin duyệt hoặc từ chối
  2. **APPROVED** → Admin chuyển khoản và đánh dấu hoàn thành
  3. **COMPLETED** → Đã xử lý xong
  4. **REJECTED** → Hoàn lại số dư hoa hồng cho user

## API Endpoints

### Dashboard
```
GET /admin/stats
```

### Users
```
GET /admin/users?page=1&limit=20&search=&role=
PUT /admin/users/:id/balance
PUT /admin/users/:id/role
```

### Products
```
GET /admin/products
POST /admin/products
PUT /admin/products/:id
DELETE /admin/products/:id
POST /admin/products/:id/stock
POST /admin/products/:id/stock/bulk
```

### Transactions
```
GET /admin/transactions?page=1&limit=50&type=
```

### Withdrawals
```
GET /admin/withdrawals?status=
PUT /admin/withdrawals/:id/approve
PUT /admin/withdrawals/:id/complete
PUT /admin/withdrawals/:id/reject
```

## Authentication & Authorization

### Middleware
- Tất cả routes `/admin/*` yêu cầu JWT authentication
- Backend kiểm tra `user.role === 'ADMIN'`
- Frontend redirect về `/dashboard` nếu không phải admin

### Layout Protection
```typescript
// frontend/src/app/admin/layout.tsx
useEffect(() => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData.role !== 'ADMIN') {
    router.push('/dashboard');
  }
}, []);
```

## Installation & Setup

### 1. Backend Setup

Thêm AdminModule vào `app.module.ts`:
```typescript
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // ... other modules
    AdminModule,
  ],
})
```

### 2. Frontend Setup

Fonts đã được thêm vào `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### 3. Create Admin User

```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE username = 'admin';
```

### 4. Access Admin Panel

1. Login với tài khoản admin
2. Truy cập: `http://localhost:3000/admin`

## UI Components

### Stat Cards
```tsx
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-600">Label</p>
      <p className="text-2xl font-bold text-slate-900">Value</p>
    </div>
    <div className="bg-blue-500 p-3 rounded-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
</div>
```

### Data Table
```tsx
<table className="w-full">
  <thead className="bg-slate-50 border-b">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
        Header
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-200">
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">Content</td>
    </tr>
  </tbody>
</table>
```

### Modal
```tsx
<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">Title</h2>
    {/* Content */}
  </div>
</div>
```

## Responsive Breakpoints

- **Mobile**: 375px - 767px (1 column)
- **Tablet**: 768px - 1023px (2 columns)
- **Desktop**: 1024px - 1439px (3-4 columns)
- **Large**: 1440px+ (4 columns)

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers
- Semantic HTML (`<table>`, `<thead>`, `<tbody>`)
- ARIA labels where needed
- Focus states visible

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Performance

### Optimization
- Pagination for large datasets
- Lazy loading for images
- Debounced search inputs
- Memoized components

### Loading States
- Skeleton screens
- Spinner animations
- Disabled states during API calls

## Error Handling

### Frontend
```typescript
try {
  await adminApi.updateUserBalance(userId, data);
  alert('Thành công!');
  onSuccess();
} catch (error) {
  console.error('Failed:', error);
  alert('Có lỗi xảy ra');
}
```

### Backend
```typescript
if (user.role !== 'ADMIN') {
  throw new Error('Unauthorized: Admin access required');
}
```

## Testing

### Manual Testing Checklist

#### Dashboard
- [ ] Stats load correctly
- [ ] Quick actions navigate to correct pages
- [ ] Responsive on mobile/tablet/desktop

#### Users
- [ ] Search works
- [ ] Role filter works
- [ ] Pagination works
- [ ] Balance adjustment works
- [ ] Role change works

#### Products
- [ ] Products display correctly
- [ ] Add single stock works
- [ ] Add bulk stock works
- [ ] Stock count updates

#### Transactions
- [ ] All transactions load
- [ ] Type filter works
- [ ] Pagination works
- [ ] Data displays correctly

#### Withdrawals
- [ ] Status filter works
- [ ] Approve workflow works
- [ ] Complete workflow works
- [ ] Reject workflow works
- [ ] Commission balance refunded on reject

## Future Enhancements

- [ ] Export data to CSV/Excel
- [ ] Advanced analytics charts
- [ ] Real-time notifications
- [ ] Bulk user operations
- [ ] Activity logs
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Two-factor authentication
- [ ] IP whitelist
- [ ] Audit trail

## Troubleshooting

### "Unauthorized" error
- Check user role in database
- Verify JWT token is valid
- Check localStorage has correct user data

### Stats not loading
- Check backend is running
- Verify database connection
- Check CORS settings

### Fonts not loading
- Check internet connection
- Verify Google Fonts URL in globals.css
- Clear browser cache

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub hoặc liên hệ team dev.

---

**Design System**: PrimeAcc Admin (Data-Dense Dashboard)
**Last Updated**: 2026-02-28
**Version**: 1.0.0
