/**
 * Safely checks if a string is a valid email (basic regex check).
 * Prefer Zod validators for strict form validation.
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
