# PrimeAcc Design System

## Overview
Design system được tạo bởi ui-ux-pro-max skill, tối ưu cho nền tảng SaaS dịch vụ SMM và bán tài khoản premium.

## Design Principles

### Pattern: App Store Style Landing
- Show real screenshots and features
- Include ratings (4.5+ stars)
- Platform-specific CTAs
- Device mockups and carousels

### Style: Glassmorphism
- Frosted glass effects with backdrop blur (12-16px)
- Transparent backgrounds with subtle borders
- Layered depth with shadows
- Light source effects

## Color Palette

### Light Mode
- **Primary**: `#0F172A` (Navy)
- **Secondary**: `#334155` (Slate)
- **CTA**: `#0369A1` (Blue)
- **Background**: `#F8FAFC` (Light Gray)
- **Text**: `#020617` (Almost Black)

### Dark Mode
- **Primary**: `#0369A1` (Blue)
- **Background**: `#0F172A` (Navy)
- **Card**: `#1E293B` (Dark Slate)
- **Text**: `#F8FAFC` (Light)

## Typography

### Font Families
- **Headings**: Poppins (400, 500, 600, 700)
- **Body**: Open Sans (300, 400, 500, 600, 700)

### Usage
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

body {
  font-family: 'Open Sans', sans-serif;
}
```

## Components

### Glass Card
```tsx
<div className="glass-card rounded-2xl p-6">
  {/* Content */}
</div>
```

### Glass Effect
```tsx
<div className="glass rounded-xl p-4">
  {/* Content */}
</div>
```

### Gradient Button
```tsx
<button className="rounded-xl bg-gradient-to-r from-cta to-primary px-6 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-cta/30 cursor-pointer">
  Button Text
</button>
```

### Icon with Background
```tsx
<div className="rounded-xl bg-gradient-to-br from-cta/20 to-primary/20 p-3">
  <Icon className="h-6 w-6 text-cta" />
</div>
```

## Spacing & Layout

### Border Radius
- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)
- Extra Large: `rounded-3xl` (24px)

### Padding
- Tight: `p-3` or `p-4`
- Normal: `p-5` or `p-6`
- Loose: `p-8` or `p-10`

## Interactions

### Transitions
- Duration: 150-300ms
- Easing: `ease` or `ease-in-out`

### Hover States
```tsx
hover:border-primary/30
hover:shadow-xl
hover:shadow-primary/10
hover:scale-105
```

### Active States
```tsx
active:scale-95
active:scale-98
```

### Focus States
```tsx
focus:outline-none
focus:ring-2
focus:ring-ring
focus:border-transparent
```

## Accessibility

### Contrast Ratios
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

### Keyboard Navigation
- All interactive elements have focus states
- Tab order is logical
- Skip links where appropriate

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Icons

### Library
- **Lucide React** - Modern, consistent icon set
- Size: `h-4 w-4` to `h-6 w-6` for most cases

### Usage
```tsx
import { Icon } from "lucide-react";

<Icon className="h-5 w-5 text-muted-foreground" />
```

## Pre-Delivery Checklist

- [ ] No emojis as icons (use Lucide React SVG)
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode text contrast 4.5:1 minimum
- [ ] Glass effects visible in both light/dark modes
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px

## Pages Implemented

1. **Landing Page** (`/`) - Hero, features, services, CTA
2. **Login Page** (`/login`) - Authentication with social login
3. **Dashboard** (`/dashboard`) - Stats, recent orders, suggestions
4. **SMM Services** (`/dashboard/smm`) - Service catalog with filters
5. **Shop** (`/dashboard/shop`) - Account products with ratings
6. **Deposit** (`/dashboard/deposit`) - Payment methods and history
7. **API Docs** (`/dashboard/api`) - API documentation and examples
8. **Partnership** (`/dashboard/partnership`) - Referral program

## Components

1. **Navbar** - Search, notifications, theme toggle, user menu
2. **Sidebar** - Navigation with active states, balance display

## Running the Project

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Design System Files

- `frontend/src/app/globals.css` - Global styles, colors, glassmorphism
- `design-system/primeacc/MASTER.md` - Complete design system documentation
- `.agent/skills/ui-ux-pro-max/` - UI/UX skill with searchable database
