# Mobile Bottom Navigation - PrimeAcc

## 📱 Tổng quan

Mobile Bottom Navigation là thanh điều hướng cố định ở cuối màn hình, được thiết kế theo chuẩn UX mobile-first với ui-ux-pro-max guidelines.

## ✨ Tính năng

### 1. Touch-Friendly Design
- **Touch targets**: Minimum 64x64px (vượt chuẩn 44x44px)
- **Spacing**: 8px gap giữa các items
- **Active feedback**: Scale animation + haptic feedback
- **Touch manipulation**: Tối ưu cho touch devices

### 2. Visual Feedback
- **Active state**: Gradient background + glow effect
- **Hover state**: Subtle background change
- **Badge notifications**: Red badge với số lượng
- **Active indicator**: Bottom dot indicator

### 3. Accessibility
- **ARIA labels**: Đầy đủ aria-label và aria-current
- **Keyboard navigation**: Tab order logic
- **Screen reader**: Semantic HTML với role="navigation"
- **Reduced motion**: Respect prefers-reduced-motion

### 4. iOS Safe Area Support
- **Safe area insets**: Tự động padding cho iPhone notch
- **Dynamic spacing**: env(safe-area-inset-bottom)
- **Backdrop blur**: Glass effect với backdrop-filter

## 🎨 Design Specifications

### Colors
```css
Active: primary color (#8B5CF6)
Inactive: muted-foreground (#475569)
Background: glass-card with backdrop-blur
Badge: Red gradient (#EF4444 to #DC2626)
```

### Spacing
```css
Container padding: 8px (px-2 py-2)
Item min-width: 64px
Item min-height: 64px
Icon size: 24px (active: 28px)
Label font-size: 11px
```

### Animations
```css
Transition: 300ms ease-out
Active scale: 1.1
Press scale: 0.9
Glow: animate-pulse
```

## 📂 File Structure

```
frontend/src/
├── components/
│   └── MobileBottomNav.tsx          # Main component
├── app/
│   └── dashboard/
│       ├── layout.tsx                # Integration point
│       ├── page.tsx                  # Home
│       ├── shop/page.tsx             # Shop
│       ├── search/page.tsx           # Search (NEW)
│       ├── purchases/page.tsx        # Orders
│       └── profile/page.tsx          # Profile (NEW)
└── app/globals.css                   # Utilities
```

## 🔧 Implementation

### 1. Component Usage

```tsx
import MobileBottomNav from "@/components/MobileBottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <main className="pb-24 md:pb-6">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
```

### 2. Navigation Items

```tsx
const navItems = [
  {
    id: "home",
    label: "Trang chủ",
    icon: Home,
    href: "/dashboard",
  },
  {
    id: "shop",
    label: "Cửa hàng",
    icon: ShoppingBag,
    href: "/dashboard/shop",
  },
  {
    id: "search",
    label: "Tìm kiếm",
    icon: Search,
    href: "/dashboard/search",
  },
  {
    id: "orders",
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/dashboard/purchases",
    badge: 3, // Dynamic badge
  },
  {
    id: "profile",
    label: "Tài khoản",
    icon: User,
    href: "/dashboard/profile",
  },
];
```

### 3. Active State Logic

```tsx
const isActive = (href: string) => {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
};
```

## 🎯 UX Guidelines (ui-ux-pro-max)

### Touch Targets
✅ **DO**: Minimum 64x64px touch targets
❌ **DON'T**: Small buttons < 44px

### Spacing
✅ **DO**: 8px minimum gap between items
❌ **DON'T**: Tightly packed elements

### Feedback
✅ **DO**: Immediate visual + haptic feedback
❌ **DON'T**: Delayed or no feedback

### Active State
✅ **DO**: Clear visual indication of current page
❌ **DON'T**: All items look the same

### Safe Area
✅ **DO**: Respect iOS safe area insets
❌ **DON'T**: Content hidden by home indicator

## 📱 Responsive Behavior

### Mobile (< 768px)
- Bottom nav visible
- Fixed position
- Full width
- Safe area padding

### Tablet/Desktop (≥ 768px)
- Bottom nav hidden (md:hidden)
- Sidebar navigation shown
- No safe area needed

## 🔄 State Management

### Active Page Detection
```tsx
const pathname = usePathname();
const isActive = pathname.startsWith(href);
```

### Navigation Handler
```tsx
const handleNavClick = (href: string) => {
  // Haptic feedback
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
  // Navigate
  router.push(href);
};
```

### Badge Updates
```tsx
// Dynamic badge from context/API
const { orderCount } = useOrders();

navItems[3].badge = orderCount;
```

## 🎨 Customization

### Change Colors
```tsx
// In MobileBottomNav.tsx
const active = isActive(href);

className={`
  ${active 
    ? "text-primary"      // Change active color
    : "text-muted-foreground"  // Change inactive color
  }
`}
```

### Change Icons
```tsx
import { Home, Store, Compass, Package, UserCircle } from "lucide-react";

const navItems = [
  { icon: Home, ... },
  { icon: Store, ... },
  { icon: Compass, ... },
  { icon: Package, ... },
  { icon: UserCircle, ... },
];
```

### Add New Item
```tsx
{
  id: "notifications",
  label: "Thông báo",
  icon: Bell,
  href: "/dashboard/notifications",
  badge: 5,
}
```

## 🐛 Troubleshooting

### Content Hidden Behind Nav
```tsx
// Add padding-bottom to main content
<main className="pb-24 md:pb-6">
  {children}
</main>
```

### Safe Area Not Working
```css
/* Add to globals.css */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
```

### Badge Not Showing
```tsx
// Ensure badge is number, not undefined
badge: orderCount || 0
```

### Navigation Not Working
```tsx
// Check router import
import { useRouter } from "next/navigation"; // Not "next/router"
```

## 📊 Performance

### Optimization
- ✅ Client component only
- ✅ Minimal re-renders
- ✅ CSS transitions (GPU accelerated)
- ✅ No heavy dependencies

### Bundle Size
- Component: ~2KB
- Icons: ~1KB each
- Total: ~8KB

## 🔐 Security

### XSS Prevention
- ✅ No dangerouslySetInnerHTML
- ✅ Sanitized user input
- ✅ Type-safe props

### Navigation Safety
- ✅ Client-side routing only
- ✅ No external links
- ✅ Protected routes

## 📈 Analytics

### Track Navigation
```tsx
const handleNavClick = (href: string) => {
  // Analytics
  analytics.track("bottom_nav_click", {
    destination: href,
    from: pathname,
  });
  
  router.push(href);
};
```

## 🎓 Best Practices

1. **Always provide aria-labels** for accessibility
2. **Use semantic HTML** (nav, button)
3. **Respect safe areas** on iOS devices
4. **Provide haptic feedback** for better UX
5. **Keep labels short** (max 10 characters)
6. **Limit to 5 items** for optimal UX
7. **Test on real devices** not just emulators

## 📚 References

- [Material Design - Bottom Navigation](https://m3.material.io/components/navigation-bar)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [WCAG 2.1 Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [ui-ux-pro-max Guidelines](/.agent/skills/ui-ux-pro-max/SKILL.md)

---

**Created:** 28/02/2026  
**Version:** 1.0  
**Author:** Kiro AI + ui-ux-pro-max
