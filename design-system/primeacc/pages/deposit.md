# Deposit Page Design Override

> **LOGIC:** This file overrides `design-system/MASTER.md` for the Deposit page.
> Use these rules when building `/dashboard/deposit`.

---

**Page:** Deposit / Payment
**Generated:** 2026-02-28
**Override Priority:** HIGH

---

## Page-Specific Rules

### Color Adjustments

| Role | Hex | Usage |
|------|-----|-------|
| Success/Confirm | `#22C55E` | Successful transactions, QR active state |
| Warning/Pending | `#F59E0B` | Pending transactions, important notices |
| Info/Guide | `#3B82F6` | Instructions, helper text |
| Error/Alert | `#EF4444` | Failed transactions, validation errors |

### QR Code Section

**Style:** Glassmorphic card with subtle glow effect

```css
.qr-container {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(34, 197, 94, 0.05));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(124, 58, 237, 0.2);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.qr-container:hover {
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 12px 48px rgba(34, 197, 94, 0.2);
}
```

### Payment Method Cards

**Interaction:** Smooth morphing on selection

```css
.payment-method {
  position: relative;
  overflow: hidden;
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.payment-method::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(124, 58, 237, 0.1));
  opacity: 0;
  transition: opacity 400ms ease;
}

.payment-method.selected::before {
  opacity: 1;
}

.payment-method.selected {
  transform: scale(1.02);
  border-color: #22C55E;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}
```

### Copy Button Animation

```css
.copy-button {
  position: relative;
  transition: all 200ms ease;
}

.copy-button:active {
  transform: scale(0.95);
}

.copy-button.copied {
  color: #22C55E;
}

.copy-button.copied::after {
  content: '✓';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeUp 600ms ease;
}

@keyframes fadeUp {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
}
```

### Amount Input

**Style:** Large, prominent with smooth focus transition

```css
.amount-input {
  font-size: 24px;
  font-weight: 700;
  height: 72px;
  border: 2px solid rgba(124, 58, 237, 0.2);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.amount-input:focus {
  border-color: #7C3AED;
  box-shadow: 0 0 0 6px rgba(124, 58, 237, 0.1);
  transform: scale(1.01);
}
```

### Transaction Status Badges

```css
.status-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-pending {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-failed {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header: "Nạp tiền vào tài khoản"                    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌─────────────────────────┐ │
│ │ Payment Methods     │ │ QR Code (if selected)   │ │
│ │ [Bank] [Momo] [ATM] │ │ ┌─────────────────────┐ │ │
│ └─────────────────────┘ │ │   [QR Image]        │ │ │
│                         │ │                     │ │ │
│ ┌─────────────────────┐ │ │ Bank: MB Bank       │ │ │
│ │ Amount Input        │ │ │ Account: 0123456789 │ │ │
│ │ [50K][100K][200K]   │ │ │ Content: NAP XXXXX  │ │ │
│ └─────────────────────┘ │ └─────────────────────┘ │ │
│                         └─────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Transaction History                             │ │
│ │ • +500,000đ - 25/02/2024 [Success]              │ │
│ │ • +200,000đ - 23/02/2024 [Success]              │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## UX Guidelines

### Do's ✓
- Show QR code immediately when amount is entered
- Auto-refresh QR every 5 minutes for security
- Display clear copy buttons with visual feedback
- Show transaction status in real-time
- Provide estimated processing time
- Highlight required fields (especially transfer content)
- Use smooth transitions for all state changes

### Don'ts ✗
- Don't hide bank details behind tabs
- Don't use small QR codes (minimum 200x200px)
- Don't auto-submit without user confirmation
- Don't show expired QR codes
- Don't use confusing status labels
- Don't hide transaction fees

---

## Accessibility

- QR code must have alt text with bank details
- All copy buttons must have aria-labels
- Status badges must use aria-live for screen readers
- Amount input must have clear label and validation
- Keyboard navigation for all interactive elements
- High contrast mode support for QR code

---

## Performance

- Lazy load QR code generation
- Cache bank information
- Debounce amount input (300ms)
- Optimize transaction history queries (limit 10)
- Use skeleton loaders for async data

---

## Security

- Generate unique transfer content per transaction
- Validate amount range (min: 10,000đ, max: 50,000,000đ)
- Rate limit QR generation (max 10/minute)
- Sanitize all user inputs
- Use HTTPS for all API calls
- Implement CSRF protection on webhook
