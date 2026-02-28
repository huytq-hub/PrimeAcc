# Deposit Components

## AmountInput

Component nhập số tiền với validation và preset buttons.

### Features

- ✅ Format số tiền tự động (1,000,000)
- ✅ Validation real-time (min/max)
- ✅ Auto-correct khi blur
- ✅ Preset quick select buttons
- ✅ Visual feedback (border color, animations)
- ✅ Accessible (keyboard navigation, screen readers)

### Usage

```tsx
import { AmountInput } from "@/components/deposit/AmountInput";

function DepositPage() {
  const [amount, setAmount] = useState("");

  return (
    <AmountInput
      value={amount}
      onChange={setAmount}
      min={10000}
      max={50000000}
      presets={[50000, 100000, 200000, 500000]}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current amount value |
| `onChange` | `(value: string) => void` | required | Change handler |
| `min` | `number` | `10000` | Minimum amount |
| `max` | `number` | `50000000` | Maximum amount |
| `presets` | `number[]` | `[50000, 100000, 200000, 500000]` | Quick select amounts |

### Validation Rules

- Minimum: 10,000 VND
- Maximum: 50,000,000 VND
- Only numeric input allowed
- Auto-format with thousand separators
- Auto-correct on blur if out of range

### Accessibility

- `inputMode="numeric"` for mobile keyboards
- Clear error messages
- Visual feedback for invalid states
- Keyboard navigation for preset buttons
- Screen reader friendly

### Styling

Uses Tailwind CSS with custom transitions:
- Border color changes on focus/error
- Scale animation on focus
- Smooth transitions (300ms)
- Glassmorphism effect

## Future Components

- `QRCodeDisplay` - QR code with expiry timer
- `TransactionHistory` - Transaction list with filters
- `PaymentMethodSelector` - Payment method cards
