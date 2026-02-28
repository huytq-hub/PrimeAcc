# Shop Page Overrides

> **PROJECT:** PrimeAcc
> **Generated:** 2026-02-28 01:03:28
> **Page Type:** E-commerce / Shop
> **Updated:** 2026-02-28 (Added Contact Upgrade Section)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 
  1. Hero (Search focused)
  2. Categories
  3. Featured Listings (Product Grid)
  4. Contact Upgrade Section (NEW)
  5. Trust/Safety
  6. CTA (Become a host/seller)

### Spacing Overrides

- Contact Upgrade Section: `mt-16` (64px) separation from product grid
- Internal spacing follows Master spacing tokens

### Typography Overrides

- No overrides — use Master typography (Rubik + Nunito Sans)

### Color Overrides

- **Strategy:** Search: High contrast. Categories: Visual icons. Trust: Blue/Green.
- **Contact Section:** Primary purple for icons, CTA green for submit button
- **Glass Effects:** Liquid glass with morphing blur and color transitions

### Component Overrides

- **Contact Upgrade Component:**
  - FAQ accordion with smooth 400ms transitions
  - Form with glass inputs and gradient CTA button
  - Benefits grid with hover scale effects
  - Alternative contact methods (Phone, Telegram)

---

## Page-Specific Components

### ContactUpgrade Component

**Purpose:** Allow users to request account verification upgrade

**Features:**
- Hero section with animated blur backgrounds
- 3-column benefits grid (Security, Priority Support, Discounts)
- FAQ accordion (4 common questions)
- Contact form (Name, Phone, Email, Message)
- Alternative contact methods (Hotline, Telegram)

**Interactions:**
- FAQ items expand/collapse with smooth transitions
- Form submission with loading state
- Success message with auto-dismiss (5s)
- Hover effects on all interactive elements

**Accessibility:**
- All form fields have labels with required indicators
- Focus states visible on all inputs
- Smooth transitions respect `prefers-reduced-motion`
- Semantic HTML structure

---

## Recommendations

- Effects: Morphing elements (SVG/CSS), fluid animations (400-600ms curves), dynamic blur (backdrop-filter), color transitions
- CTA Placement: Hero Search Bar + Navbar 'List your item' + Contact Form Submit
- Form Validation: Client-side validation with clear error messages
- Mobile: Stack benefits grid to single column, maintain touch targets 44x44px minimum
