# Theme System - PrimeAcc

## Tổng quan

Hệ thống theme mới được thiết kế dựa trên ui-ux-pro-max với:
- Màu chủ đạo: Navy (#0F172A) thay vì Rose (#E11D48)
- 5 bảng màu tùy chọn: Navy, Rose, Emerald, Violet, Amber
- Chế độ Light/Dark mode
- Lưu trữ tự động vào localStorage

## Thay đổi chính

### 1. Màu sắc mới (Navy Theme)

**Light Mode:**
- Primary: #0F172A (Navy)
- Secondary: #F59E0B (Amber)
- CTA: #8B5CF6 (Purple)
- Background: #F8FAFC
- Text: #0F172A

**Dark Mode:**
- Primary: #F59E0B (Amber)
- Secondary: #FBBF24 (Light Amber)
- CTA: #A78BFA (Light Purple)
- Background: #0F172A (Navy)
- Text: #F8FAFC

### 2. Bảng màu có sẵn

| Theme | Primary | Secondary | CTA | Mô tả |
|-------|---------|-----------|-----|-------|
| Navy | #0F172A | #F59E0B | #8B5CF6 | Chuyên nghiệp & Sang trọng |
| Rose | #E11D48 | #FB7185 | #2563EB | Năng động & Hiện đại |
| Emerald | #059669 | #10B981 | #3B82F6 | Tươi mới & Tự nhiên |
| Violet | #7C3AED | #8B5CF6 | #EC4899 | Sáng tạo & Độc đáo |
| Amber | #D97706 | #F59E0B | #8B5CF6 | Ấm áp & Thân thiện |

## Files đã thay đổi

### 1. `frontend/src/app/globals.css`
- Cập nhật màu Navy làm mặc định
- Thêm 5 theme variants với `data-theme` attribute
- Cải thiện dark mode với Navy background

### 2. `frontend/src/contexts/ThemeContext.tsx` (MỚI)
- React Context để quản lý theme state
- Lưu/load từ localStorage
- Hỗ trợ light/dark mode và color themes

### 3. `frontend/src/app/layout.tsx`
- Wrap app với ThemeProvider
- Thêm `suppressHydrationWarning` để tránh lỗi hydration

### 4. `frontend/src/app/dashboard/settings/page.tsx`
- Thêm Theme Customizer section
- UI để chọn Light/Dark mode
- UI để chọn 5 color themes
- Preview màu trực quan

### 5. `frontend/src/components/Sidebar.tsx`
- Thêm nút toggle Light/Dark mode ở header
- Icon Sun/Moon tùy theo theme hiện tại

## Cách sử dụng

### Trong Component

```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme, colorTheme, setTheme, setColorTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current color: {colorTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setColorTheme("rose")}>Set Rose</button>
    </div>
  );
}
```

### Trong CSS

Sử dụng CSS variables:
```css
.my-element {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}
```

Hoặc Tailwind classes:
```tsx
<div className="bg-primary text-primary-foreground">
  Content
</div>
```

## Tính năng

✅ **5 bảng màu tùy chọn** - Navy, Rose, Emerald, Violet, Amber
✅ **Light/Dark mode** - Chuyển đổi dễ dàng
✅ **Auto-save** - Lưu tự động vào localStorage
✅ **Instant apply** - Áp dụng ngay lập tức
✅ **Visual preview** - Xem trước màu trước khi chọn
✅ **Quick toggle** - Nút toggle ở Sidebar
✅ **Hydration safe** - Không gây lỗi hydration

## UI/UX Guidelines (từ ui-ux-pro-max)

### Data-Dense Dashboard Style
- Multiple charts/widgets
- Data tables with KPI cards
- Minimal padding, grid layout
- Space-efficient, maximum data visibility
- Best for: Business intelligence, financial analytics

### Typography
- Heading: Poppins (600 weight)
- Body: Open Sans (300-700 weights)
- Monospace: Fira Code (cho code/data)

### Effects
- Glassmorphism với backdrop-blur
- Smooth transitions (150-300ms)
- Hover tooltips
- Row highlighting on hover

### Accessibility
- WCAG AA compliant
- 4.5:1 contrast ratio minimum
- Focus states visible
- prefers-reduced-motion support

## Testing

Để test theme system:

1. Mở Settings page (`/dashboard/settings`)
2. Thử chuyển Light/Dark mode
3. Thử chọn các color themes khác nhau
4. Reload page để kiểm tra localStorage
5. Kiểm tra tất cả pages có áp dụng đúng màu

## Troubleshooting

**Theme không lưu:**
- Kiểm tra localStorage có enabled không
- Xem console có lỗi không

**Màu không đổi:**
- Hard refresh (Ctrl+Shift+R)
- Clear cache và reload

**Hydration error:**
- Đã fix với `suppressHydrationWarning` trong layout
- ThemeProvider load theme từ localStorage sau khi mount
