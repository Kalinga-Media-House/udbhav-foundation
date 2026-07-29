/**
 * Formats a Date object or ISO string into a localized, human-readable string.
 * Uses native Intl API.
 */
export const formatDate = (date: Date | string, locale = 'en-IN'): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

/**
 * Formats a Date object or ISO string into a localized date-time string.
 */
export const formatDateTime = (date: Date | string, locale = 'en-IN'): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(d);
};
