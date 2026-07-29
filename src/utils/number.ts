/**
 * Formats a number into Indian Rupees (INR).
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Typically no paise shown unless required
  }).format(amount);
};

/**
 * Formats a number using standard Indian commas (lakhs/crores).
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};
