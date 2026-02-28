/**
 * Amount validation utilities for deposit feature
 */

export const AMOUNT_LIMITS = {
  MIN: 10000, // 10,000 VND
  MAX: 50000000, // 50,000,000 VND
} as const;

export interface AmountValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate deposit amount
 */
export function validateAmount(amount: string | number): AmountValidationResult {
  const numAmount = typeof amount === "string" ? parseInt(amount) : amount;

  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      isValid: false,
      error: "Vui lòng nhập số tiền hợp lệ",
    };
  }

  if (numAmount < AMOUNT_LIMITS.MIN) {
    return {
      isValid: false,
      error: `Số tiền tối thiểu là ${formatCurrency(AMOUNT_LIMITS.MIN)}`,
    };
  }

  if (numAmount > AMOUNT_LIMITS.MAX) {
    return {
      isValid: false,
      error: `Số tiền tối đa là ${formatCurrency(AMOUNT_LIMITS.MAX)}`,
    };
  }

  return { isValid: true };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

/**
 * Parse amount from formatted string
 */
export function parseAmount(formatted: string): number {
  return parseInt(formatted.replace(/[^0-9]/g, "")) || 0;
}

/**
 * Suggest nearest valid amount
 */
export function suggestValidAmount(amount: number): number {
  if (amount < AMOUNT_LIMITS.MIN) return AMOUNT_LIMITS.MIN;
  if (amount > AMOUNT_LIMITS.MAX) return AMOUNT_LIMITS.MAX;
  return amount;
}
