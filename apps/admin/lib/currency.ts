export const CURRENCY_CODE = 'INR';
export const CURRENCY_SYMBOL = '₹';

/**
 * Formats a monetary amount into Indian Rupee format (e.g., ₹1,499 or ₹1,499.00)
 */
export function formatPrice(amount: number | string | null | undefined, showDecimals = false): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0`;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}
