/**
 * Safely chunk an array into smaller arrays of a specified size.
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * Filter out undefined and null values from an array, returning a strictly typed array.
 */
export const filterFalsy = <T>(array: (T | null | undefined | false)[]): T[] => {
  return array.filter((item): item is T => Boolean(item));
};
