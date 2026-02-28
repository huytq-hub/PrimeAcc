/**
 * Deposit feature constants
 */

export const DEPOSIT_PRESETS = {
  BASIC: [50000, 100000, 200000, 500000],
  POPULAR: [100000, 200000, 500000, 1000000],
  LARGE: [500000, 1000000, 2000000, 5000000],
} as const;

export const PAYMENT_METHODS = [
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    fee: "0%",
    instant: true,
    disabled: false,
    description: "Nhanh chóng, miễn phí",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    fee: "0%",
    instant: true,
    disabled: true,
    description: "Sắp ra mắt",
  },
  {
    id: "card",
    name: "Thẻ ATM/Visa",
    fee: "2%",
    instant: false,
    disabled: true,
    description: "Sắp ra mắt",
  },
] as const;

export const QR_CONFIG = {
  EXPIRY_MINUTES: 5,
  REFRESH_THRESHOLD_SECONDS: 30, // Show refresh warning when < 30s left
  AUTO_REFRESH_ON_EXPIRE: false,
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: {
    label: "Thành công",
    color: "green",
    icon: "check-circle",
  },
  PENDING: {
    label: "Đang xử lý",
    color: "orange",
    icon: "clock",
  },
  FAILED: {
    label: "Thất bại",
    color: "red",
    icon: "x-circle",
  },
} as const;
